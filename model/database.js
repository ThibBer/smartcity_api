const pg = require("pg");
const Pool = pg.Pool;

const loginSettings = {
    user: "john",
    host: "localhost",
    database: "exercices",
    password: "password",
    port: 3000
};

const pool = new Pool(loginSettings);

module.exports = pool;