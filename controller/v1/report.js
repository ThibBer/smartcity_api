const pool = require('../../model/v1/database');
const Report = require("../../model/v1/report");
const User = require("../../model/v1/user");
const ReportType = require("../../model/v1/reportType");
const Event = require("../../model/v1/event");

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            const {rows: reports} = await Report.get(client, id);
            const report = reports[0];

            if(report !== undefined){
                res.status(200).json(report);
            }else{
                res.status(404).json({error: "Invalid report ID"});
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
        const {rows: reports} = await Report.all(client);
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.getWithUserId = async(req, res) => {
    const client = await pool.connect();
    const userId = parseInt(req.params.userId);

    try {
        if(isNaN(userId)) {
            res.sendStatus(400);
        } else {
            const reporterExist = await User.exist(client, userId);
            if(!reporterExist) {
                res.status(404).json({error: "Incorrect reported id"});
            } else {
                const {rows: reports} = await Report.getWithUserId(client, userId);
                res.status(200).json(reports);
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
    let {description, state, city, street, zip_code, house_number, reporter, report_type} = req.body;

    try {
        const reporterExist = await User.exist(client, reporter);
        const reportTypeExist = await ReportType.exist(client, report_type.id);

        if(!reporterExist){
            res.status(404).json({error: "Incorrect reporter id"});
        }else if(!reportTypeExist) {
            res.status(404).json({error: "Incorrect report type id"});
        } else {
            const result = await Report.post(client, description, state, city, street, zip_code, house_number, reporter, report_type.id);
            res.status(200).json({id: result.rows[0].id});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.patch = async(req, res) => {
    const client = await pool.connect();
    const {id, description, state, city, street, zip_code, house_number, reporter, report_type} = req.body;

    try{
        const reportExist = await Report.exist(client, id);
        const reporterExist = await User.exist(client, reporter);
        const reportTypeExist = await ReportType.exist(client, report_type.id);
        if(reportExist && reporterExist && reportTypeExist) {
            await Report.patch(client, id, description, state, city, street, zip_code, house_number, reporter, report_type.id);
            res.sendStatus(204);
        } else {
            res.status(404).json({error: "Incorrect id"});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

module.exports.delete = async(req, res) => {
    const {id} = req.body;
    const client = await pool.connect();

    try{
        await client.query("BEGIN;");
        const reportExist = await Report.exist(client, id);
        if(reportExist) {
            await Event.deleteLinkedToReport(client, id);
            await Report.delete(client, id);
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