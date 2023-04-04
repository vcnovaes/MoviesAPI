-- Active: 1680460396136@@127.0.0.1@3306

CREATE TABLE
    movie (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(256),
        description TEXT,
        rating SMALLINT,
        secret BOOLEAN,
        category VARCHAR(100)
    )