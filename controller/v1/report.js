const pool = require('../../model/v1/database');
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

        if(reports !== undefined){
            res.status(200).json(reports);
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
    const {description, state, city, street, zip_code, house_number, reporter, report_type} = req.body;

    try {
        const reporterExist = await User.exist(client, reporter);
        const reportTypeExist = await ReportType.exist(client, report_type);
        if(reporterExist && reportTypeExist) {
            await Report.post(client, description, state, city, street, zip_code, house_number, reporter, report_type);
            res.sendStatus(204);
        } else {
            res.sendStatus(404).json({error: "Retry with correct values"});
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
        const reportTypeExist = await ReportType.exist(client, report_type);
        if(reportExist && reporterExist && reportTypeExist) {
            await Report.patch(client, id, description, state, city, street, zip_code, house_number, reporter, report_type);
            res.sendStatus(204);
        } else {
            res.sendStatus(404).json({error: "Retry with correct values"});
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
        const reportExist = await Report.exist(client, id);
        if(reportExist) {
            await Report.delete(client, id);
            res.sendStatus(204);
        } else {
            res.sendStatus(404).json({error: "Incorrect id"});
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}