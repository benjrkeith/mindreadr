import db from './db.js'

const statement = `
CREATE TABLE IF NOT EXISTS public.users
(
    username TEXT NOT NULL PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.users OWNER to mindreadr;


CREATE TABLE IF NOT EXISTS public.posts
(
    key INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent INT REFERENCES posts(key) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.posts OWNER to mindreadr;


CREATE TABLE IF NOT EXISTS public.likes
(
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    post INT NOT NULL REFERENCES posts(key) ON DELETE CASCADE,
    PRIMARY KEY (username, post)
);

ALTER TABLE IF EXISTS public.likes OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.followers
(
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    follower TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    PRIMARY KEY (username, follower)
);

ALTER TABLE IF EXISTS public.followers OWNER to mindreadr;
`

db.connect().then((client) => {
  client.query(statement).then(res => {
    console.log(res)
    client.release()
    db.end()
  })
})
