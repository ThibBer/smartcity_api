const pool = require('../../model/v1/database');
const ReportType = require("../../model/v1/reportType");

module.exports.get = async(req, res) => {
    const client = await pool.connect();
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            const {rows: users} = await ReportType.get(client, id);
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
        const {rows: reportTypes} = await ReportType.all(client);

        if(reportTypes !== undefined){
            res.status(200).json(reportTypes);
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
    const {label} = req.body;

    try {
        await ReportType.post(client, label);
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
    const body = req.body;
    console.log(body)
    const {id, label} = body;

    try {
        if (isNaN(id)) {
            res.sendStatus(400);
        } else {
            const response = await ReportType.patch(client, id, label);

            if(response !== undefined){
                res.sendStatus(204);
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

module.exports.delete = async(req, res) => {
    throw new Error("Not implemented");
}