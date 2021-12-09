const Router = require("express-promise-router");
const router = new Router;

const ReportTypeController = require("../controller/reportType");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

router.get('/:id', ReportTypeController.get);
router.get("/", ReportTypeController.all);

router.get("/filter/:offset&:limit&:filter", ReportTypeController.filter);
router.get("/filter/:offset&:limit", ReportTypeController.filter);

/**
 * @swagger
 * /reportType:
 *  post:
 *      tags:
 *          - ReportType
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ReportTypeToAdd'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ReportTypeAdded'
 *          400:
 *              description: JWT invalide ou libellé du type de signalement invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/InvalidReportTypeLabel'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', JWTMiddleware.identification, Authorization.mustBeAdmin, ReportTypeController.post);

/**
 * @swagger
 * /reportType:
 *  patch:
 *      tags:
 *          - ReportType
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ReportTypeToPatch'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ReportTypePatched'
 *          400:
 *              description: JWT invalide, id ou libellé du type de signalement invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/InvalidReportTypeIdOrLabel'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowReportType'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', JWTMiddleware.identification, Authorization.mustBeAdmin, ReportTypeController.patch);

/**
 * @swagger
 * /reportType:
 *  delete:
 *      tags:
 *          - ReportType
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              description: Id de l'événement à supprimer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ReportTypeDeleted'
 *          400:
 *              description: JWT invalide ou id du type de signalement invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/InvalidReportTypeId'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowReportType'
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', JWTMiddleware.identification, Authorization.mustBeAdmin, ReportTypeController.delete);

module.exports = router;