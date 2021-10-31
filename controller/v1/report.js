const pool = require('../../model/v1/database');
const Report = require("../../model/v1/report");

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
    throw new Error("Not implemented");
}

module.exports.patch = async(req, res) => {
    throw new Error("Not implemented");
}

module.exports.delete = async(req, res) => {
    throw new Error("Not implemented");
}