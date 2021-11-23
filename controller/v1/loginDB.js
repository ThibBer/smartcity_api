require("dotenv").config();
const process = require('process');
const jwt = require('jsonwebtoken');

const pool = require("../../model/v1/database");
const loginDB = require("../../model/v1/loginDB");

module.exports.login = async(req, res) => {
    const client = await pool.connect();
    const {email, password} = req.body;

    try {
        if(email === undefined || password === undefined) {
            res.sendStatus(400);
        } else {
            const user = await loginDB.get(client, email, password);
            if(user === null) {
                res.sendStatus(404);
            } else {
                const payload = {id: user.id, email, first_name: user.first_name, last_name: user.last_name, role: user.role};
                const token = jwt.sign(payload, process.env.SECRET_TOKEN, {expiresIn: '1d'});

                res.status(200).json(token);
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}