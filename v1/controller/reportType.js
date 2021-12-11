const pool = require('../model/database');
const ReportType = require("../model/reportType");
const Report = require("../model/report");

/**
 * @swagger
 * components:
 *  schemas:
 *      ReportType:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: integer
 *              label:
 *                  type: string
 *                  description: Libellé du type de signalement
 *
 */

/**
 * @swagger
 *  components:
 *      responses:
 *          InvalidReportTypeId:
 *              description: Id du type de signalement invalide
 *          UnknowReportType:
 *              description: Type de signalement introuvable
 */
module.exports.get = async(req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({error: "Id du type de signalement invalide"});
    } else {
        const client = await pool.connect();

        try {
            const reportType = await ReportType.get(client, id);

            if(reportType === undefined){
                res.sendStatus(404);
            }else{
                res.status(200).json(reportType);
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
        const {rows: reportTypes} = await ReportType.all(client);
        res.status(200).json(reportTypes);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    } finally {
        client.release();
    }
}

/**
 * @swagger
 * components:
 *  responses:
 *      InvalidReportTypeFilterData:
 *          description: Filtre, limite ou décalage invalide
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 *      ValidReportTypeFilter:
 *          description: Types de signalements correspondants au filtre, décalage et limite
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          countWithoutLimit:
 *                              type: integer
 *                              description: Nombre de données correspond au filtre sans limite
 *                          data:
 *                              type: array
 *                              items:
 *                                  $ref: '#/components/schemas/User'
 *                              description: Utilisateurs correspondants au filter, avec limite et décalage
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
            const promiseReportTypesFilter = ReportType.filter(client, filter, offset, limit);
            const promiseReportTypesCountFilter = ReportType.countWithFilter(client, filter);

            promises.push(promiseReportTypesFilter, promiseReportTypesCountFilter);

            const values = await Promise.all(promises);

            const reportTypes = values[0].rows;
            const counts = parseInt(values[1].rows[0].count);

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

/**
 *@swagger
 *components:
 *  responses:
 *      ReportTypeAdded:
 *          description: Le type de signalement a été ajouté
 *          content:
 *              application/json:
 *                  schema:
 *                      type: integer
 *                      description: Id du type de signalement créé
 *      InvalidReportTypeLabel:
 *          description: Libellé invalide
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 *  requestBodies:
 *      ReportTypeToAdd:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/ReportType'
 */
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

/**
 *@swagger
 *components:
 *  responses:
 *      ReportTypePatched:
 *          description: Le type de signalement a été modifié
 *      InvalidReportTypeIdOrLabel:
 *          description: Id ou libellé invalide
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 *      UnknowReportType:
 *          description: Type de signalement introuvable
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
 *  requestBodies:
 *      ReportTypeToPatch:
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/ReportType'
 */
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

/**
 *@swagger
 *components:
 *  responses:
 *      ReportTypeDeleted:
 *          description: Le type de signalement a été supprimée
 *      InvalidReportTypeId:
 *          description: Id du type de signalement invalide
 *
 */
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
                res.status(404).json({error: "Le signalement n'existe pas"});
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