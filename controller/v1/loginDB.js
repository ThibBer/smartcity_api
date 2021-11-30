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
                const token = jwt.sign({user:user}, process.env.SECRET_TOKEN, {expiresIn: '1d'});

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