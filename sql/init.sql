-- Init DB and seed sample users and posts for Red_Social_ADUSOFT
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  alias VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  birth_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (post_id, user_id)
);

-- Seed users (passwords are plain for seeding; on services we'll hash)
INSERT INTO users (first_name,last_name,alias,email,password_hash,birth_date)
VALUES
('Juan','Pérez','juanp','juan@example.com','password1','1990-05-15'),
('María','Gómez','mariag','maria@example.com','password2','1992-08-20'),
('Carlos','Lopez','carlosl','carlos@example.com','password3','1988-12-01');

-- Seed posts
INSERT INTO posts (user_id,message) VALUES
(1, 'Hola mundo desde Juan!'),
(2, 'Mi primera publicación — María.'),
(3, 'Saludos desde Carlos.');
