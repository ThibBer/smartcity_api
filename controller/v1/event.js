const pool = require('../../model/v1/database');
const Event = require("../../model/v1/event");
const Report = require("../../model/v1/report");
const User = require("../../model/v1/user");
const Participation = require("../../model/v1/participation");

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);
    // TODO : Passer via les jointures
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
                res.status(404).json({error: "Incorrect id"});
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
        res.status(200).json(events);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.filter = async(req, res) => {
    const filter = req.params.filter;
    const offset = req.params.offset;
    const limit = req.params.limit;

    if(isNaN(offset)){
        res.status(400).json({error: "Offset invalide"});
    } else if(isNaN(limit)){
        res.status(400).json({error: "Limite invalide"});
    }else{
        const client = await pool.connect();

        try {
            await client.query("BEGIN;");

            const {rows: events} = await Event.filter(client, filter, offset, limit);
            const {rows} = await Event.countWithFilter(client, filter);
            await client.query("COMMIT;");

            const counts = rows[0].count;

            res.status(200).json({countWithoutLimit: counts, data: events});
        } catch (error) {
            await client.query("ROLLBACK;");
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.getWithReportId = async(req, res) => {
    const client = await pool.connect();
    const reportId = parseInt(req.params.reportId);

    try {
        if(isNaN(reportId)) {
            res.sendStatus(400);
        } else {
            const reportExist = await Report.exist(client, reportId);
            if(!reportExist) {
                res.status(404).json({error: "Incorrect report id"});
            } else {
                const {rows: events} = await Event.getWithReportId(client, reportId);
                res.status(200).json(events);
            }
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
    const {date_hour, duration, description, report, creator} = req.body;

    try {
        const reportExist = await Report.exist(client, report);
        const creatorExist = await User.exist(client, creator);
        if(reportExist && creatorExist) {
            const result = await Event.post(client, date_hour, duration, description, report, creator);
            res.status(200).json({id: result.rows[0].id});
        } else {
            res.status(404).json({error: "Incorrect id"});
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
    const {id, date_hour, duration, description, report, creator} = req.body;

    try {
        const eventExist = await Event.exist(client, id);

        if(eventExist){
            await Event.patch(client, id, date_hour, duration, description, report, creator);
            res.sendStatus(204);
        }else{
            res.status(404).json({error: "Incorrect id"});
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
            await client.query("BEGIN;");
            await Participation.deleteRelatedToEvent(client, id);
            await Event.delete(client, id);
            await client.query("COMMIT;");
            res.sendStatus(204);
        } else {
            await client.query("ROLLBACK;");
            res.status(404).json({error: "Incorrect id"});
        }
    } catch (error) {
        await client.query("ROLLBACK;");
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}