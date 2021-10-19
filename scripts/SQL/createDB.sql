DROP TABLE IF EXISTS user CASCADE;
CREATE TABLE user (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar NOT NULL,
    login varchar NOT NULL,
    password varchar NOT NULL,
    first_name varchar NOT NULL,
    last_name varchar NOT NULL,
    birth_date timestamp NOT NULL
)

DROP TABLE IF EXISTS report CASCADE;
CREATE TABLE report (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description varchar,
    state varchar NOT NULL,
    city varchar NOT NULL,
    street varchar NOT NULL,
    create_at timestamp NOT NULL,
    reporter integer REFERENCES user(id) NOT NULL
)

DROP TABLE IF EXISTS event CASCADE;
CREATE TABLE event (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date date NOT NULL,
    created_at timestamp NOT NULL,
    length integer,
    report integer REFERENCES report(id) NOT NULL,
    user integer REFERENCES user(id) NOT NULL,
)

DROP TABLE IF EXISTS commentary CASCADE;
CREATE TABLE commentary (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text varchar NOT NULL,
    created_at timestamp NOT NULL,
    writer integer REFERENCES user(id) NOT NULL,
    event integer REFERENCES event(id) NOT NULL,
)

DROP TABLE IF EXISTS participation CASCADE;
CREATE TABLE participation (
    participant integer REFERENCES user(id),
    event integer REFERENCES event(id),
    PRIMARY KEY (participant, event)
)