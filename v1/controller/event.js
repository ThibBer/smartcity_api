const pool = require('../model/database');
const Event = require("../model/event");
const Report = require("../model/report");
const User = require("../model/user");
const Participation = require("../model/participation");

/**
 * @swagger
 * components:
 *  schemas:
 *      Event:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: integer
 *              date_hour:
 *                  type: string
 *                  description: Date / heure de l'événement
 *              duration:
 *                  type: number
 *                  format: integer
 *                  description: Durée de l'événement
 *              description:
 *                  type: string
 *                  description: Description de l'événement
 *              created_at:
 *                  type: string
 *                  description: Tiemstamp de la création de l'événement
 *              report:
 *                  $ref: '#/components/schemas/Report'
 *              creator:
 *                  $ref: '#/components/schemas/User'
 *
 */

/**
 * @swagger
 *  components:
 *      responses:
 *          InvalidOffset:
 *              description: L'offset est invalide
 *          InvalidLimit:
 *              description: La limite est invalide
 */
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
            const promises = [];
            const promiseEventsFilter = Event.filter(client, filter, offset, limit);
            const promiseEventsCountFilter = Event.countWithFilter(client, filter);

            promises.push(promiseEventsFilter, promiseEventsCountFilter);

            const values = await Promise.all(promises);

            const events = values[0].rows;
            const counts = parseInt(values[1].rows[0].count);

            res.status(200).json({countWithoutLimit: counts, data: events});
        } catch (error) {
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
                res.sendStatus(404);
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
        // description is optional
        if(date_hour === undefined || duration === undefined || report === undefined){
            res.sendStatus(400);
        }else{
            const reportId = report?.id || report;
            const creatorId = creator?.id || creator;

            const reportExist = await Report.exist(client, reportId);
            const creatorExist = creatorId === undefined || await User.exist(client, creatorId);

            if(!reportExist || !creatorExist){
                res.sendStatus(404);
            }else{
                const result = await Event.post(client, date_hour, duration, description, reportId, creatorId);
                res.status(200).json({id: result.rows[0].id});
            }
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
        if(isNaN(id) || (date_hour === undefined && duration === undefined && description === undefined && report === undefined && creator === undefined)){
            res.sendStatus(400);
        }else{
            const eventExist = await Event.exist(client, id);
            const creatorId = creator?.id || creator;
            const creatorExist = creatorId === undefined || await User.exist(client, creatorId);

            if(!eventExist || !creatorExist){
                res.sendStatus(404);
            }else{
                await Event.patch(client, id, date_hour, duration, description, report?.id || report, creatorId);
                res.sendStatus(204);
            }
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
    const id = parseInt(req.body?.id);

    try{
        if(isNaN(id)){
            res.sendStatus(400);
        }else{
            const eventExist = await Event.exist(client, id);

            if(!eventExist) {
                res.sendStatus(404);
            } else {
                await client.query("BEGIN;");

                await Participation.deleteRelatedToEvent(client, id);
                await Event.delete(client, id);

                await client.query("COMMIT;");

                res.sendStatus(204);
            }
        }
    } catch (error) {
        await client.query("ROLLBACK;");
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}