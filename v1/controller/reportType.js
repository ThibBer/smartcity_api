const pool = require('../model/database');
const ReportType = require("../model/reportType");
const Report = require("../model/report");
const ImageManager = require("../model/imageManager");
const uuid = require("uuid");
const REPORT_TYPE_OUTPUT_DIRECTORY = "./../../images/reportTypes/";

/**
 * @swagger
 * components:
 *  schemas:
 *      TypeSignalement:
 *          type: object
 *          properties:
 *              id:
 *                  type: number
 *                  format: integer
 *              label:
 *                  type: string
 *                  description: Libellé du type de signalement
 *              image:
 *                  type: string
 *                  description: Image du type de signalement
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

// No Swagger doc needed
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
 *          description: limite ou décalage invalide
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          error:
 *                              type: string
 *                              description: Message erreur
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
 *      InvalidReportTypeLabelOrImage:
 *          description: Libellé ou image invalide
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
 *               multipart/form-data:
 *                   schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: number
 *                              format: integer
 *                          label:
 *                              type: string
 *                              description: Libellé du type de signalement
 *                          image:
 *                              type: string
 *                              format: byte
 *                              description: Bytes de l'image du type de signalement
 */
module.exports.post = async(req, res) => {
    const {label} = req.body;
    console.log(req.files)
    const image = req.files.image[0];

    if(label === undefined || label.trim() === "") {
        res.status(400).json({error: "Label invalide"});
    }else if(image === undefined){
        res.status(400).json({error: "Image invalide"});
    }else{
        const client = await pool.connect();

        try {
            const imageName = uuid.v4() + ".jpeg";

            await client.query("BEGIN;");
            const result = await ReportType.post(client, label, imageName);

            await ImageManager.save(image.buffer, imageName, REPORT_TYPE_OUTPUT_DIRECTORY);

            await client.query("COMMIT;");

            res.status(201).json({id: result.rows[0].id, image: imageName});
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
 *      ReportTypePatched:
 *          description: Le type de signalement a été modifié
 *      InvalidReportTypeIdOrLabelOrImage:
 *          description: Id libellé ou image invalide
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
 *               multipart/form-data:
 *                   schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: number
 *                              format: integer
 *                          label:
 *                              type: string
 *                              description: Libellé du type de signalement
 *                          image:
 *                              type: string
 *                              format: byte
 *                              description: Bytes de l'image du type de signalement
 */
module.exports.patch = async(req, res) => {
    const {id, label} = req.body;
    const image = req.files.image[0];

    if (isNaN(id) || ((label === undefined || label.trim() === "") && image === undefined)) {
        res.sendStatus(400);
    }else {
        const client = await pool.connect();

        try {
            const reportType = await ReportType.get(client, id);

            if(reportType === undefined){
                res.sendStatus(404);
            }else{
                await ReportType.patch(client, id, label);

                ImageManager.replace(image.buffer, reportType.image, REPORT_TYPE_OUTPUT_DIRECTORY);
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
            const reportType = ReportType.get(client, id);

            if(reportType === undefined) {
                res.status(404).json({error: "Le signalement n'existe pas"});
            } else {
                await client.query("BEGIN;");
                await Report.patchReportsWhenTypeDelete(client, id);
                await ReportType.delete(client, id);
                await client.query("COMMIT;");


                ImageManager.delete(reportType.image, REPORT_TYPE_OUTPUT_DIRECTORY);
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