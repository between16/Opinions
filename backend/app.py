from flask import Flask, request, jsonify
from flask_cors import CORS
from flask import g
import os
import sqlite3
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from nlp import sentimentRestult


app = Flask(__name__)
cors = CORS (app, origins="*")

#the secret key is generated through this piece of code:
app.secret_key = 'a421c210278fd00c726cf138acbe3780410109e3857df5b7475d847cd4813a41'

app.config.from_object(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'database.db'),
    SCHEMA=os.path.join(app.root_path, 'schema.sql')
))

#connects to the specific sqlite3 database
def connect_db():
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

#opens a new connection for this context g
def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

#this is executed every time the context is teardown, it closes the connection
@app.teardown_appcontext
def close_db(error):
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

#this is the function called in the flask script defined below, it uses the schema to initialize the database
#IT WILL DROP EVERY TABLE PRESENT IF CALLED
def init_db():
    db = get_db()
    with app.open_resource(app.config['SCHEMA'], mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

#definition of the flask script, now you can write "flask initdb" in the terminal to initialize the database
@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')


'''
API SECTION
'''

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

#login control
@app.route("/api/login", methods =['POST'])
def get_data():
    #client sends username and password
    data = request.get_json()
    username = data['username']
    password = data['password']


    db = get_db()
    cur = db.cursor()
    #extract the password hash from the database if present
    cur.execute('SELECT username, user_password FROM User WHERE username = ?', (username,))

    user = cur.fetchone()

    if user is None:   
        #the query result is empty, the credentials are worng!
        return jsonify({'message': 'Incorrect'})
    elif not check_password_hash(user["user_password"], password):
        #check_password_hash() returned false! the passwords do not match
        return jsonify({'message': 'Incorrect'})
    else :
        #everything is good, the user can login
        print("login completed")
        return jsonify({'message': 'Correct'})
    


#sign in a new user
@app.route("/api/signUp", methods=['POST'])
def save_data():

    #get username and password from client
    data = request.get_json()
    username = data['username']
    password = data['password']

    #since username is a primary key for the User table no duplicates are allowed, so no check is needed, if the username is invalid
    #the exception will be executed
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute('INSERT INTO User (username, user_password) VALUES (?, ?)', (username, generate_password_hash(password)))
        db.commit()
        print("registretion complited")
        return jsonify({'message': 'Done'})
    
    except Exception as e:
        # the username was already used
        return jsonify({'message': 'Error: {}'.format(str(e))})
    
#Add a new statement and comment to the database
@app.route("/api/addStatement", methods=["POST"])
def addStatement():
    data = request.get_json()

    # Check if all necessary fields are present
    if not all(key in data for key in ["username", "topic", "statement", "comment"]):
        return jsonify({"message": "Missing required fields"}), 400  # Bad Request

    username = data["username"]
    topic = data["topic"]
    statement = data["statement"]
    comment = data["comment"]


    #sentiment analysis result 
    sentiment = sentimentRestult(comment)


    try:
        db = get_db()
        cur = db.cursor()
        cur.execute('INSERT INTO Post (username, topic, statemant, sentiment, comment) VALUES (?, ?, ?, ?, ?)', 
                    (username, topic, statement,sentiment, comment))
        db.commit()
        print("Registration onto database completed")
        return jsonify({'message': 'Done'}), 200  # Success response

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500  # Internal Server Error


#get all the statements for a specific topic
@app.route("/api/getStatements", methods=["POST"])
def getStatements():
    # Get the topic from the request JSON
    data = request.get_json()
    topic = data.get("topic")

    if not topic:
        return jsonify({"message": "Topic is required"}), 400  # Bad Request if topic is missing

    db = get_db()
    cur = db.cursor()

    try:
        # Query the database to fetch all statements for the specific topic
        cur.execute('SELECT statemant FROM Post WHERE topic = ?', (topic,))
        rows = cur.fetchall()

        # If no results, return a message
        if not rows:
            print("errore nei dati")
            return jsonify({"message": "No statements found for this topic"}), 404  # Not Found

        # Extract only the statements from the query result
        statements = [row["statemant"] for row in rows]

        return jsonify({"statements": statements}), 200  # Success response

    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500  # Internal Server Error

'''
File exec
'''
if __name__ == '__main__':
    app.run(debug=True)