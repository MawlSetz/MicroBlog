DROP TABLE IF EXISTS daapPosts;

CREATE TABLE daapPosts (
  id INTEGER PRIMARY KEY,
  name TEXT, year TEXT, semester TEXT, city TEXT, company TEXT, roommate TEXT, contact TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER timestamp_update BEFORE UPDATE ON posts BEGIN
  UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;