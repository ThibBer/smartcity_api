const pool = require('../../model/v1/database');
const Participation = require("../../model/v1/participation");
const User = require("../../model/v1/user");
const Event = require("../../model/v1/event");

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const participant = parseInt(req.params.participant);
    const event = parseInt(req.params.event);
    try {
        if (isNaN(participant) || isNaN(event)) {
            res.sendStatus(400);
        } else {
            const {rows: participations} = await Participation.get(client, participant, event);
            const participation = participations[0];
            if(participation !== undefined){
                res.status(200).json(participation);
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
        const {rows: participations} = await Participation.all(client);

        if(participations !== undefined) {
            res.status(200).json(participations);
        } else {
            res.sendStatus(404);
        }
    } catch(error) {
        console.error(error);
    } finally {
        client.release();
    }
}

module.exports.post = async(req, res) => {
    const client = await pool.connect();
    const {participant, event} = req.body;

    try {
        const userExist = await User.exist(client, participant);
        const eventExist = await Event.exist(client, event);

        if(userExist && eventExist) {
            await Participation.post(client, participant, event);
            res.sendStatus(201);
        } else {
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
    const {participant, event} = req.body;

    try {
        let userExist = false;
        let eventExist = false;

        if(participant !== undefined) {
            userExist = await User.exist(client, participant);
        }

        if(event !== undefined) {
            eventExist = await Event.exist(client, event);
        }

        if(userExist) {
            if(eventExist) {
                await Participation.delete(client, participant, event);
                res.sendStatus(204);
            } else {
                await Participation.deleteRelatedToUser(client, participant);
                res.sendStatus(204);
            }
        } else {
            if(eventExist) {
                await Participation.deleteRelatedToEvent(client, event);
                res.sendStatus(204);
            } else {
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