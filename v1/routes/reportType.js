const Router = require("express-promise-router");
const router = new Router;

const ReportTypeController = require("../controller/reportType");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

/**
 * @swagger
* /v1/reportType/{id}:
 *  get:
 *      tags:
 *         - Type de signalement
 *      parameters:
 *          - name: Id
 *            description: Id du type de signalement
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Récupère un type de signalement à partir de son id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReportType'
 *          400:
 *              $ref: '#/components/responses/InvalidReportTypeId'
 *          404:
 *              $ref: '#/components/responses/UnknowReportType'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', ReportTypeController.get);

/**
 * @swagger
* /v1/reportType:
 *  get:
 *      tags:
 *         - Type de signalement
 *      responses:
 *          200:
 *              description: Récupère tous les types de signalement
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/ReportType'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/", ReportTypeController.all);

/**
 * @swagger
* /v1/reportType/filter/{offset}&{limit}&{filter}:
 *  get:
 *      tags:
 *         - Type de signalement
 *      parameters:
 *          - name: Offset
 *            description: Valeur du décalage
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: Limit
 *            description: Nombre de données à retourner
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: Filter
 *            description: Filter à appliquer sur les données
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Types de signalements correspondant au filtre, à la limite et au décalage
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              countWithoutLimit:
 *                                  type: integer
 *                                  description: Nombre d'éléments correspondant au filtre, à la limite et au décalage
 *                              data:
 *                                  description: Types de signalements correspondants au filter, avec limite et décalage
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/ReportType'
 *          400:
 *              $ref: '#/components/responses/InvalidReportTypeFilterData'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit&:filter", ReportTypeController.filter);
router.get("/filter/:offset&:limit", ReportTypeController.filter);

/**
 * @swagger
* /v1/reportType:
 *  post:
 *      tags:
 *          - Type de signalement
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
* /v1/reportType:
 *  patch:
 *      tags:
 *          - Type de signalement
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
* /v1/reportType:
 *  delete:
 *      tags:
 *          - Type de signalement
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