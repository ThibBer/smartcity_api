const pool = require('../../model/v1/database');
const ReportType = require("../../model/v1/reportType");
const Report = require("../../model/v1/report");

module.exports.get = async(req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({error: "Id du type de signalement invalide"});
    } else {
        const client = await pool.connect();

        try {
            const {rows: users} = await ReportType.get(client, id);

            const user = users[0];
            if(user === undefined){
                res.sendStatus(404);
            }else{
                res.status(200).json(user);
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.all = async(req, res) => {
    const client = await pool.connect();

    try {
        const {rows: users} = await ReportType.all(client);
        res.status(200).json(users);
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

            const {rows: reportTypes} = await ReportType.filter(client, filter, offset, limit);
            const {rows} = await ReportType.countWithFilter(client, filter);
            await client.query("COMMIT;");

            const counts = rows[0].count;

            res.status(200).json({countWithoutLimit: counts, data: reportTypes});
        } catch (error) {
            await client.query("ROLLBACK;");
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.post = async(req, res) => {
    const {label} = req.body;

    if(label === undefined || label.trim() === ""){
        res.status(400).json({error: "Label invalide"});
    }else{
        const client = await pool.connect();

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
}

module.exports.patch = async(req, res) => {
    const {id, label} = req.body;

    if (isNaN(id)) {
        res.status(400).json({error: "Id invalide"});
    } if (label === undefined || label.trim() === "") {
        res.status(400).json({error: "Label invalide"});
    }else {
        const client = await pool.connect();

        try {
            const reportTypeExist = await ReportType.exist(client, id);

            if(!reportTypeExist){
                res.sendStatus(404);
            }else{
                await ReportType.patch(client, id, label);
                res.sendStatus(204);
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.delete = async(req, res) => {
    const id = parseInt(req.body.id);

    if(isNaN(id)){
        res.sendStatus(400);
    }else{
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
}