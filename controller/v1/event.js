const pool = require('../../model/v1/database');
const Event = require("../../model/v1/event");

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            const {rows: events} = await Event.get(client, id);
            const event = events[0];
            if(event !== undefined){
                res.status(200).json(event);
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
        const {rows: events} = await Event.all(client);

        if(events !== undefined){
            res.status(200).json(events);
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
    throw new Error("Not implemented");
}

module.exports.patch = async(req, res) => {
    throw new Error("Not implemented");
}

module.exports.delete = async(req, res) => {
    throw new Error("Not implemented");
}