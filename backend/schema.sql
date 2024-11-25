DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Post;


CREATE TABLE User (
  username VARCHAR(30) PRIMARY KEY,
  user_password VARCHAR(30) NOT NULL
);

CREATE TABLE Post (
  post_id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic VARCHAR(30) NOT NULL,
  statement VARCHAR(100) NOT NULL,  -- Corrected typo
  comment VARCHAR(100) NOT NULL,
  sentiment FLOAT, 
  username VARCHAR(30) NOT NULL,
  like_number INTEGER DEFAULT 0, 
  FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
);

CREATE TABLE Likes (
  like_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(30) NOT NULL,
  post_id INTEGER NOT NULL,
  UNIQUE(username, post_id),  -- Prevent duplicate likes
  FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);
