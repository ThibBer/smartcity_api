const pool = require('../../model/v1/database');
const ReportType = require("../../model/v1/reportType");
const Report = require("../../model/v1/report");

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
        const result = await ReportType.post(client, label);

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
    const {id, label} = req.body;

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
    const {id} = req.body;
    const client = await pool.connect();

    try {
        await client.query("BEGIN;");
        const typeExist = ReportType.exist(client, id);
        if(typeExist) {
            await Report.patchReportsWhenTypeDelete(client, id);
            await ReportType.delete(client, id);
            await client.query("COMMIT;");
            res.sendStatus(204);
        } else {
            await client.query("ROLLBACK");
            res.status(404).json({error: "Incorrect id"});
        }
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}