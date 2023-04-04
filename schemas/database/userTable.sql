CREATE TABLE
    user(
        username VARCHAR(256) NOT NULL PRIMARY KEY,
        email VARCHAR(256) UNIQUE NOT NULL,
        password VARCHAR(256) NOT NULL,
        first_name VARCHAR(256) NOT NULL,
        last_name VARCHAR(256) NOT NULL,
        confirmed_email BOOLEAN NOT NULL DEFAULT FALSE,
        profile_img BLOB
    );