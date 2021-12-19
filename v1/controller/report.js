const pool = require('../model/database');
const Report = require("../model/report");
const User = require("../model/user");
const ReportType = require("../model/reportType");
const Event = require("../model/event");
const Participation = require("../model/participation");

/**
 * @swagger
 * components:
 *  schemas:
 *      Signalement:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: integer
 *              description:
 *                  type: string
 *                  description: Description de l'événement
 *              state:
 *                  type: string
 *                  description: État du report
 *              city:
 *                  type: string
 *                  description: Ville du report
 *              street:
 *                  type: string
 *                  description: Rue du report
 *              zip_code:
 *                  type: number
 *                  format: integer
 *                  description: Code postal du report
 *              house_number:
 *                  type: number
 *                  format: integer
 *                  description: Numéro d'habitation du report
 *              created_at:
 *                  type: string
 *                  description: Tiemstamp de la création de l'événement
 *              reporter:
 *                  $ref: '#/components/schemas/UtilisateurSansMotDePasse'
 *              report_type:
 *                  $ref: '#/components/schemas/TypeSignalement'
 *      SignalementSimple:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: integer
 *              description:
 *                  type: string
 *                  description: Description de l'événement
 *              state:
 *                  type: string
 *                  description: État du report
 *              city:
 *                  type: string
 *                  description: Ville du report
 *              street:
 *                  type: string
 *                  description: Rue du report
 *              zip_code:
 *                  type: number
 *                  format: integer
 *                  description: Code postal du report
 *              house_number:
 *                  type: number
 *                  format: integer
 *                  description: Numéro d'habitation du report
 *              created_at:
 *                  type: string
 *                  description: Tiemstamp de la création de l'événement
 *              reporter:
 *                  type: number
 *                  format: integer
 *                  description: Id du créateur du signalement
 *              report_type:
 *                  type: number
 *                  format: integer
 *                  description: Id du type de signalement
 *      SignalementSimpleSansId:
 *          type: object
 *          properties:
 *              description:
 *                  type: string
 *                  description: Description de l'événement
 *              state:
 *                  type: string
 *                  description: État du report
 *              city:
 *                  type: string
 *                  description: Ville du report
 *              street:
 *                  type: string
 *                  description: Rue du report
 *              zip_code:
 *                  type: number
 *                  format: integer
 *                  description: Code postal du report
 *              house_number:
 *                  type: number
 *                  format: integer
 *                  description: Numéro d'habitation du report
 *              created_at:
 *                  type: string
 *                  description: Tiemstamp de la création de l'événement
 *              reporter:
 *                  type: number
 *                  format: integer
 *                  description: Id du créateur du signalement
 *              report_type:
 *                  type: number
 *                  format: integer
 *                  description: Id du type de signalement
 *
 */

/**
 *@swagger
 *components:
 *  responses:
 *      UnknowReportObject:
 *          description: Signalement introuvable
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 */
module.exports.get = async(req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const report = await Report.get(client, id);

            if(report === undefined){
                res.status(404).json({error: "ID du signalement invalide"});
            }else{
                res.status(200).json(report);
            }
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
 *          InvalidReportFilterData:
 *               description: Utilisateur introuvable
 *               content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Message erreur
 */
module.exports.filterWithOffsetLimit = async(req, res) => {
    const filter = req.params.filter;
    const offset = parseInt(req.params.offset);
    const limit = parseInt(req.params.limit);

    if(isNaN(offset)){
        res.status(400).json({error: "Offset invalide"});
    } else if(isNaN(limit)){
        res.status(400).json({error: "Limite invalide"});
    }else{
        const client = await pool.connect();
        try {
            const promises = [];
            const promiseFilterWithOffsetLimit = Report.filterWithOffsetLimit(client, filter, offset, limit);
            const promiseCountWithFilter = Report.countWithFilter(client, filter);

            promises.push(promiseFilterWithOffsetLimit, promiseCountWithFilter);

            const values = await Promise.all(promises);

            const reports = values[0].rows;
            const counts = parseInt(values[1].rows[0].count);

            res.status(200).json({countWithoutLimit: counts, data: reports});
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

module.exports.filter = async(req, res) => {
    const filter = req.params.filter;
    const client = await pool.connect();

    try {
        const {rows: reports} = await Report.filter(client, filter);
        res.status(200).json(reports);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 * @swagger
 *  components:
 *      responses:
 *          InvalidReportId:
 *              description: Id du signalement invalide
 *          UnknowReport:
 *              description: Signalement introuvable
 */
module.exports.getWithUserId = async(req, res) => {
    const userId = parseInt(req.params.userId);

    if(isNaN(userId)) {
        res.sendStatus(400);
    } else {
        const client = await pool.connect();

        try {
            const reporterExist = await User.exist(client, userId);

            if(!reporterExist) {
                res.status(404);
            } else {
                const {rows: reports} = await Report.getWithUserId(client, userId);
                res.status(200).json(reports);
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ReportAdded:
 *          description: Le signalement a été ajouté
 *          content:
 *              application/json:
 *                  schema:
 *                      type: integer
 *                      description: Id du signalement créé
 *      MissingReportBodyData:
 *          description: Donnée manquante dans le body
 *      UnknowReportTypeOrCreator:
 *          description: Type de signalement ou utilisateur introuvable
 *  requestBodies:
 *      ReportToAdd:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SignalementSimpleSansId'
 */
module.exports.post = async(req, res) => {
    let {description, state, city, street, zip_code, house_number, reporter, report_type} = req.body;

    if(state === undefined || city === undefined || street === undefined || zip_code === undefined || house_number === undefined || reporter === undefined || report_type === undefined){
        res.sendStatus(400);
    }else{
        const client = await pool.connect();

        try {
            const reporterId = reporter.id ?? reporter;
            const reportTypeId = report_type.id ?? report_type;
            const reporterExist = await User.exist(client, reporterId);
            const reportTypeExist = await ReportType.exist(client, reportTypeId);
            if(!reporterExist){
                res.status(404).json({error: "Utilisateur inconnu"});
            }else if(!reportTypeExist) {
                res.status(404).json({error: "Type de report inconnu"});
            } else {
                const result = await Report.post(client, description, state, city, street, zip_code, house_number, reporterId, reportTypeId);
                res.status(201).json({id: result.rows[0].id});
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        } finally {
            client.release();
        }
    }
}

/**
 *@swagger
 *components:
 *  responses:
 *      ReportPatched:
 *          description: Le signalement a été modifié
 *      UnknowReportOrReportTypeOrEvent:
 *          description: Signalement, type de signalement ou utilisateur introuvable
 *  requestBodies:
 *      ReportToPatch:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SignalementSimple'
 */
module.exports.patch = async(req, res) => {
    const {id, description, state, city, street, zip_code, house_number, reporter, report_type} = req.body;

    if(isNaN(id) || (state === undefined && city === undefined && street === undefined && zip_code === undefined && house_number === undefined && reporter === undefined && report_type === undefined)){
        res.sendStatus(400);
    }else{
        const client = await pool.connect();

        try{
            const reporterId = reporter?.id ?? reporter;
            const reportTypeId = report_type?.id ?? report_type;

            const reportExist = await Report.exist(client, id);
            const reporterExist = reporterId === undefined || await User.exist(client, reporterId);
            const reportTypeExist = reportTypeId === undefined || await ReportType.exist(client, reportTypeId);

            if(!reportExist || !reporterExist || !reportTypeExist) {
                res.sendStatus(404);
            } else {
                await Report.patch(client, id, description, state, city, street, zip_code, house_number, reporterId, reportTypeId);
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

/**
 *@swagger
 *components:
 *  responses:
 *      InvalidReportId:
 *          description: id du signalement invalide
 *      ReportDeleted:
 *          description: Le signalement a été supprimé
 *      UnknowReport:
 *          description: Signalement introuvable
 */
module.exports.delete = async(req, res) => {
    const id = parseInt(req.body.id);

    if(isNaN(id)){
        res.sendStatus(400);
    }else{
        const client = await pool.connect();

        try{
            const reportExist = await Report.exist(client, id);

            if(!reportExist) {
                res.sendStatus(404);
            } else {
                await client.query("BEGIN;");
                const {rows: events} = await Event.getWithReportId(client, id);
                for (const event of events) {
                    await Participation.deleteRelatedToEvent(client, event.id);
                    await Event.delete(client, event.id);
                }

                await Report.delete(client, id);

                await client.query("COMMIT;");

                res.sendStatus(204);
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