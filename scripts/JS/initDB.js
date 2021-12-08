const pool = require("../../v1/model/database");

const fs = require("fs");
const path = require("path");

async function initDB(){
    const client = await pool.connect();

    try {
        await client.query("BEGIN;");

        const createDBQuery = fs.readFileSync(path.join(__dirname, "../SQL/createDB.sql"), "UTF-8");
        await client.query(createDBQuery);

        const fillDBQuery = fs.readFileSync(path.join(__dirname, "../SQL/fillDB.sql"), "UTF-8");
        await client.query(fillDBQuery);

        await client.query("COMMIT;");
    } catch (error){
        await client.query("ROLLBACK;");
        console.error(error);
    }finally {
        client.release();
        await pool.end();
    }
}

initDB()
    .then(() => console.log("Database created !"))
    .catch(error => {
            console.error("Database creation error :");
            console.error(error)
        }
    );