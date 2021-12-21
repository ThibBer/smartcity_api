DROP TABLE IF EXISTS "User" CASCADE;
CREATE TABLE "User"
(
    id           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email        varchar NOT NULL UNIQUE,
    password     varchar NOT NULL,
    first_name   varchar NOT NULL,
    last_name    varchar NOT NULL,
    birth_date   date    NOT NULL,
    role         varchar NOT NULL,
    city         varchar NOT NULL,
    street       varchar NOT NULL,
    zip_code     integer NOT NULL,
    house_number integer NOT NULL
);

DROP TABLE IF EXISTS ReportType CASCADE;
CREATE TABLE ReportType
(
    id    integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label varchar NOT NULL,
    image varchar NOT NULL
);


DROP TABLE IF EXISTS Report CASCADE;
CREATE TABLE Report
(
    id           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    description  varchar,
    state        varchar                                NOT NULL,
    city         varchar                                NOT NULL,
    street       varchar                                NOT NULL,
    zip_code     integer                                NOT NULL,
    house_number integer,
    created_at   timestamp                              NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reporter     integer REFERENCES "User" (id),
    report_type  integer REFERENCES ReportType (id)
);

DROP TABLE IF EXISTS Event CASCADE;
CREATE TABLE Event
(
    id        integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    date_hour  timestamp                              NOT NULL,
    duration   integer,
    description varchar,
    created_at timestamp                              NOT NULL DEFAULT CURRENT_TIMESTAMP,

    report    integer REFERENCES report (id)          NOT NULL,
    creator   integer REFERENCES "User" (id)
);
DROP TABLE IF EXISTS Participation CASCADE;
CREATE TABLE Participation
(
    participant integer REFERENCES "User" (id),
    event       integer REFERENCES Event (id),

    PRIMARY KEY (participant, event)
);