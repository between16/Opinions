from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import g
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from nlp import sentimentRestult  # Ensure this is available in your environment

app = Flask(__name__)
CORS(app, origins="*")

# Secret key for the app
app.secret_key = 'a421c210278fd00c726cf138acbe3780410109e3857df5b7475d847cd4813a41'

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'database.db'),
    SCHEMA=os.path.join(app.root_path, 'schema.sql')
))


def connect_db():
    """Connects to the SQLite database."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv


def get_db():
    """Gets a database connection for the request context."""
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db


@app.teardown_appcontext
def close_db(error):
    """Closes the database at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()


def init_db():
    """Initializes the database using the schema."""
    db = get_db()
    with app.open_resource(app.config['SCHEMA'], mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()


@app.cli.command('initdb')
def initdb_command():
    """Initializes the database via CLI command."""
    init_db()
    print('Initialized the database.')


'''
API ROUTES
'''

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/api/login", methods=['POST'])
def get_data():
    """Login endpoint to authenticate users."""
    data = request.get_json()
    username = data['username']
    password = data['password']

    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT username, user_password FROM User WHERE username = ?', (username,))
    user = cur.fetchone()

    if not user or not check_password_hash(user["user_password"], password):
        return jsonify({'message': 'Incorrect'}), 401
    return jsonify({'message': 'Correct'}), 200


@app.route("/api/signUp", methods=['POST'])
def save_data():
    """Sign up endpoint to register new users."""
    data = request.get_json()
    username = data['username']
    password = data['password']

    try:
        db = get_db()
        cur = db.cursor()
        cur.execute('INSERT INTO User (username, user_password) VALUES (?, ?)', 
                    (username, generate_password_hash(password)))
        db.commit()
        return jsonify({'message': 'Done'}), 201
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 400


@app.route("/api/addStatement", methods=["POST"])
def add_statement():
    """Add a new statement and comment."""
    data = request.get_json()
    username = data["username"]
    topic = data["topic"]
    statement = data["statement"]
    comment = data["comment"]
    sentiment = sentimentRestult(comment)

    try:
        db = get_db()
        cur = db.cursor()
        cur.execute('INSERT INTO Post (username, topic, statement, sentiment, comment) VALUES (?, ?, ?, ?, ?)', 
                    (username, topic, statement, sentiment, comment))
        db.commit()
        return jsonify({'message': 'Done'}), 201
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 400


@app.route("/api/getStatements", methods=["POST"])
def get_statements():
    """Retrieve all statements for a specific topic."""
    data = request.get_json()
    topic = data.get("topic")

    db = get_db()
    cur = db.cursor()

    try:
        cur.execute('SELECT statement FROM Post WHERE topic = ?', (topic,))
        rows = cur.fetchall()

        if not rows:
            return jsonify({"message": "No statements found"}), 404

        statements = [row["statement"] for row in rows]
        return jsonify({"statements": statements}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route("/api/getComments", methods=["POST"])
def get_comments():
    """Retrieve all comments for a specific statement."""
    data = request.get_json()
    statement = data.get("statement")

    db = get_db()
    cur = db.cursor()

    try:
        cur.execute('SELECT comment, sentiment, username, like_number FROM Post WHERE statement = ?', (statement,))
        rows = cur.fetchall()

        if not rows:
            return jsonify({"message": "No comments found"}), 404

        comments = [{"comment": row["comment"], 
                     "sentiment": row["sentiment"], 
                     "username": row["username"], 
                     "likes": row["like_number"]} for row in rows]

        return jsonify({"comments": comments}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500


@app.route('/api/deleteComment', methods=['POST'])
def delete_comment():
    """Delete a specific comment."""
    data = request.json
    statement = data.get('statement')
    comment = data.get('comment')

    db = get_db()
    cur = db.cursor()

    try:
        cur.execute('DELETE FROM Post WHERE statement = ? AND comment = ?', (statement, comment))
        db.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/api/likeComment', methods=['POST'])
def like_comment():
    """Like a comment, ensuring a user can like a comment only once."""
    data = request.json
    statement = data.get('statement')
    comment = data.get('comment')
    username = data.get('username')

    db = get_db()
    cur = db.cursor()

    try:
        cur.execute('SELECT post_id FROM Post WHERE statement = ? AND comment = ?', (statement, comment))
        post = cur.fetchone()

        if not post:
            return jsonify({"success": False, "message": "Comment not found"}), 404

        post_id = post['post_id']

        cur.execute('SELECT 1 FROM Likes WHERE username = ? AND post_id = ?', (username, post_id))
        if cur.fetchone():
            return jsonify({"success": False, "message": "User already liked this comment"}), 403

        cur.execute('INSERT INTO Likes (username, post_id) VALUES (?, ?)', (username, post_id))
        cur.execute('UPDATE Post SET like_number = like_number + 1 WHERE post_id = ?', (post_id,))
        db.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    
#update username
@app.route("/api/updateUsername", methods=["POST"])
def update_username():
    """Update the username of a user and all associated posts."""
    data = request.get_json()
    new_username = data.get("newValue")  # New value for the username
    old_username = data.get("oldUsername")  # Current username (old value)

    print(f"oldUsername: {old_username}, newUsername: {new_username}")

    if not new_username or not old_username:
        return jsonify({"message": "Both new username and old username are required"}), 400

    db = get_db()
    cur = db.cursor()

    try:
        # Start a transaction using SQL commands
        cur.execute("BEGIN TRANSACTION;")

        # Update the username in the User table
        cur.execute("UPDATE User SET username = ? WHERE username = ?", (new_username, old_username))
        if cur.rowcount == 0:
            db.rollback()
            return jsonify({"message": "User not found or no changes made"}), 404

        # Update the username in the Post table for all posts by the old username
        cur.execute("UPDATE Post SET username = ? WHERE username = ?", (new_username, old_username))

        # Commit the transaction
        db.commit()

        return jsonify({"message": "Username and associated posts updated successfully"}), 200
    except Exception as e:
        # In case of error, rollback the transaction
        db.rollback()
        return jsonify({"message": f"Error: {str(e)}"}), 500




#Update user password
@app.route("/api/updatePassword", methods=["POST"])
def update_password():
    """Update the password of a user."""
    data = request.get_json()
    new_password = data.get("newValue")  # new password
    old_username = data.get("oldUsername")  # username

    if not new_password or not old_username:
        return jsonify({"message": "Both new password and old username are required"}), 400

    db = get_db()
    cur = db.cursor()

    try:
        # Hash della nuova password
        hashed_password = generate_password_hash(new_password)
        # Aggiorna la password dell'utente identificato da old_username
        cur.execute("UPDATE User SET user_password = ? WHERE username = ?", (hashed_password, old_username))
        if cur.rowcount == 0:  # Controlla se è stata effettuata una modifica
            return jsonify({"message": "User not found or no changes made"}), 404
        db.commit()
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500



if __name__ == '__main__':
    app.run(debug=True)
