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
 *      EventFilter:
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
 *                  description: Timestamp de la création de l'événement
 *              report:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: number
 *                          format: integer
 *                      description:
 *                          type: string
 *                          description: Description de l'événement
 *                      state:
 *                          type: string
 *                          description: État du report
 *                      city:
 *                          type: string
 *                          description: Ville du report
 *                      street:
 *                          type: string
 *                          description: Rue du report
 *                      zip_code:
 *                          type: number
 *                          format: integer
 *                          description: Code postal du report
 *                      house_number:
 *                          type: number
 *                          format: integer
 *                          description: Numéro d'habitation du report
 *                      created_at:
 *                          type: string
 *                          description: Timestamp de la création de l'événement
 *                      reporter:
 *                          type: number
 *                          format: integer
 *                          description: Id du créateur du signalement
 *                      report_type:
 *                          type: number
 *                          format: integer
 *                          description: Id du type de signalement
 *              creator:
 *                  $ref: '#/components/schemas/User'
 *      EventForReport:
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
 *                  type: number
 *                  format: integer
 *                  description: Id du signalement
 *              creator:
 *                  type: number
 *                  format: integer
 *                  description: Id du créateur de l'événement
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

/**
 * @swagger
 *  components:
 *      responses:
 *          InvalidReportId:
 *              description: Id du signalement invalide
 *          UnknowReport:
 *              description: Signalement inconnu
 */
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


/**
 *@swagger
 *components:
 *  responses:
 *      EventAdded:
 *          description: L'événement a été ajouté
 *          content:
 *              application/json:
 *                  schema:
 *                      type: integer
 *                      description: Id de l'évenement créé
 *      MissingEventBodyData:
 *          description: Donnée manquante dans le body
 *      UnknowEventReportOrCreator:
 *          description: Signalement ou utilisateur inconnu
 *  requestBodies:
 *      EventToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          date_hour:
 *                              type: string
 *                              description: Date / heure de l'événement
 *                          duration:
 *                              type: number
 *                              format: integer
 *                              description: Durée de l'événement
 *                          description:
 *                              type: string
 *                              description: Description de l'événement
 *                          created_at:
 *                              type: string
 *                              description: Timestamp de la création de l'événement
 *                          report:
 *                              type: number
 *                              format: integer
 *                              description: Id du signalement
 *                          creator:
 *                              type: number
 *                              format: integer
 *                              description: Id du créateur
 */

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

/**
 *@swagger
 *components:
 *  responses:
 *      EventPatched:
 *          description: L'événement a été modifié
 *      UnknowEventReportOrCreatorOrEvent:
 *          description: Signalement, événement ou utilisateur inconnu
 *  requestBodies:
 *      EventToPatch:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: number
 *                              format: integer
 *                              description: Id de l'événement
 *                          date_hour:
 *                              type: string
 *                              description: Date / heure de l'événement
 *                          duration:
 *                              type: number
 *                              format: integer
 *                              description: Durée de l'événement
 *                          description:
 *                              type: string
 *                              description: Description de l'événement
 *                          created_at:
 *                              type: string
 *                              description: Timestamp de la création de l'événement
 *                          report:
 *                              type: number
 *                              format: integer
 *                              description: Id du signalement
 *                          creator:
 *                              type: number
 *                              format: integer
 *                              description: Id du créateur
 */
module.exports.patch = async(req, res) => {
    const client = await pool.connect();
    const {id, date_hour, duration, description, report, creator} = req.body;

    try {
        if(isNaN(id) || (date_hour === undefined && duration === undefined && description === undefined && report === undefined && creator === undefined)){
            res.sendStatus(400);
        }else{
            const creatorId = creator?.id || creator;
            const reportId = report?.id || report;

            const eventExist = await Event.exist(client, id);
            const creatorExist = creatorId === undefined || await User.exist(client, creatorId);
            const reportExist = reportId === undefined || await User.exist(client, creatorId);

            if(!eventExist || !creatorExist || !reportExist){
                res.sendStatus(404);
            }else{
                await Event.patch(client, id, date_hour, duration, description, reportId, creatorId);
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

/**
 *@swagger
 *components:
 *  responses:
 *      InvalidEventId:
 *          description: id de l'événement invalide
 *      EventDeleted:
 *          description: L'événement a été supprimé
 *      UnknowEvent:
 *          description: Événement inconnu
 */
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