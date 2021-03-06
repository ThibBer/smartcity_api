require('dotenv').config();
const pg = require("pg");
const Pool = pg.Pool;

const loginSettings = {
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
};

const pool = new Pool(loginSettings);

module.exports = pool;