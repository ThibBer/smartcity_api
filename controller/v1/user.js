const pool = require('../../model/v1/database');
const User = require("../../model/v1/user");

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            const {rows: users} = await User.get(client, id);
            const user = users[0];
            if(user !== undefined){
                res.status(200).json(user);
            }else{
                res.sendStatus(404);
            }
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.all = async(req, res) => {
    const client = await pool.connect();

    try {
        const {rows: users} = await User.all(client);

        if(users !== undefined){
            res.status(200).json(users);
        }else{
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.post = async(req, res) => {
    const client = await pool.connect();
    const {email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber} = req.body;

    try {
        await User.post(client, email, password, firstName, lastName, birthDate, role, city, street, zipCode, houseNumber);

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.patch = async(req, res) => {
    const client = await pool.connect();
    const {id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number} = req.body;

    try {
        const userExist = await User.exist(client, id);

        if(userExist){
            await User.patch(client, id, email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number);
            res.sendStatus(204);
        }else{
            res.sendStatus(404);
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.delete = async(req, res) => {
    throw new Error("Not implemented");
}