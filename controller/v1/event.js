const pool = require('../../model/v1/database');
const Event = require("../../model/v1/event");
const Report = require("../../model/v1/report");
const User = require("../../model/v1/user");
const ReportType = require("../../model/v1/reportType");


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

                    const {rows: reportTypes} = await ReportType.get(client, report.report_type);

                    const reportType = reportTypes[0];
                    if(reportType !== undefined){
                        report.report_type = reportType;
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
    throw new Error("Not implemented");
}

module.exports.patch = async(req, res) => {
    throw new Error("Not implemented");
}

module.exports.delete = async(req, res) => {
    throw new Error("Not implemented");
}