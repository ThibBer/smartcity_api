const pool = require('../../model/v1/database');
const User = require("../../model/v1/user");
const Event = require("../../model/v1/event");
const Report = require("../../model/v1/report");
const Participation = require("../../model/v1/participation");
const {getHash} = require("../../utils/jwtUtils");

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
                res.status(404).json({error: "Invalid user id"});
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
    const {email, password, first_name, last_name, birth_date, role, city, street, zip_code, house_number} = req.body;

    try {
        const result = await User.post(client, email, await getHash(password), first_name, last_name, birth_date, role, city, street, zip_code, house_number);

        res.status(200).json({id: result.rows[0].id});
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
            let formatedPassword = null;
            if(password !== undefined && password !== null && password.trim() !== "") {
                formatedPassword = getHash(password);
            }
            await User.patch(client, id, email, formatedPassword, first_name, last_name, birth_date, role, city, street, zip_code, house_number);
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
    const client = await pool.connect();
    const {id} = req.body;

    try {
        const userExist = await User.exist(client, id);
        if(userExist){
            await client.query("BEGIN;");
            await Event.patchEventsWhenUserDelete(client, id);
            await Report.patchReportsWhenUserDelete(client, id);
            await Participation.deleteRelatedToUser(client, id);
            await User.delete(client, id);
            await client.query("COMMIT;");
            res.sendStatus(204);
        }else{
            await client.query("ROLLBACK;");
            res.sendStatus(404);
        }
    } catch (error) {
        await client.query("ROLLBACK;");
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}