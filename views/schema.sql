DROP TABLE IF EXISTS daapPosts;
DROP TABLE IF EXISTS postComments;

CREATE TABLE postComments (
	id INTEGER PRIMARY KEY,
	comment TEXT, postid INTEGER,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE daapPosts (
  id INTEGER PRIMARY KEY,
  name TEXT, year TEXT, semester TEXT, city TEXT, company TEXT, roommate TEXT, email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER timestamp_update BEFORE UPDATE ON daapPosts BEGIN
  UPDATE daapPosts SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;
