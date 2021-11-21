const pool = require('../../model/v1/database');
const Event = require("../../model/v1/event");
const Report = require("../../model/v1/report");
const User = require("../../model/v1/user");
const ReportType = require("../../model/v1/reportType");
const Participation = require("../../model/v1/participation");

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
                const {rows: reports} = await Report.get(client, event.report);
                const report = reports[0];

                if(report !== undefined) {
                    const {rows: users} = await User.get(client, report.reporter);
                    const user = users[0];

                    if(user !== undefined){
                        report.reporter = user;
                    }
                    event.report = report;
                }

                const {rows: creators} = await User.get(client, event.creator);

                const creator = creators[0];
                if(creator !== undefined) {
                    event.creator = creator;
                }

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
    const client = await pool.connect();
    const {date, length, create_at, report, creator} = req.body;

    try {
        const reportExist = await Report.exist(client, report);
        const creatorExist = await User.exist(client, creator);
        if(reportExist && creatorExist) {
            await Event.post(client, date, length, create_at, report, creator);
            res.sendStatus(204);
        } else {
            res.sendStatus(404).json({error: "Retry with correct values"});
        }
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.patch = async(req, res) => {
    const client = await pool.connect();
    const {id, date, length, create_at, report, creator} = req.body;

    try {
        const eventExist = await Event.exist(client, id);

        if(eventExist){
            await Event.patch(client, id, date, length, create_at, report, creator);
            res.sendStatus(204);
        }else{
            res.sendStatus(404).json({error: "Retry with correct values"});;
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

// Must delete related Participations
module.exports.delete = async(req, res) => {
    const client = await pool.connect();
    const {id} = req.body;

    try{
        const eventExist = Event.exist(client, id);
        if(eventExist) {
            await Participation.deleteRelatedToEvent(client, id);
            await Event.delete(client, id);

            res.sendStatus(204);
        } else {
            res.sendStatus(404).json({error: "Retry with correct values"});;
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}