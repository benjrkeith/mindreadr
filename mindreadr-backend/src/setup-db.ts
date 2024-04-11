import db from './db.js'

const statement = `

CREATE TABLE IF NOT EXISTS public.users
(
    username TEXT NOT NULL PRIMARY KEY,
    password TEXT NOT NULL,
    privilege INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    avatar TEXT NOT NULL DEFAULT CONCAT('/avatar', FLOOR(RANDOM() * 8 + 1)::int, '.png')
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

CREATE TABLE IF NOT EXISTS public.chats
(
    key INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

ALTER TABLE IF EXISTS public.chats OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.chat_members
(
    key INT NOT NULL REFERENCES chats(key) ON DELETE CASCADE,
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (key, username)
);

ALTER TABLE IF EXISTS public.chat_members OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.messages
(
    key INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chat INT NOT NULL REFERENCES chats(key) ON DELETE CASCADE,
    author TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.messages OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.likes
(
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    post INT NOT NULL REFERENCES posts(key) ON DELETE CASCADE,
    PRIMARY KEY (username, post),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.likes OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.followers
(
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    follower TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    PRIMARY KEY (username, follower),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.followers OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.audit
(
    username TEXT NOT NULL REFERENCES users(username),
    method TEXT NOT NULL,
    route TEXT NOT NULL,
    data TEXT,
    time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.audit OWNER to mindreadr;

CREATE TABLE IF NOT EXISTS public.notifications
(
    key INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    sender TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
    content TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE IF EXISTS public.notifications OWNER to mindreadr;

`

await db.query(statement)
