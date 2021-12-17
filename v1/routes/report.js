const Router = require("express-promise-router");
const router = new Router;

const ReportController = require("../controller/report");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

/**
 * @swagger
 * /v1/report/{id}:
 *  get:
 *      tags:
 *         - Signalement
 *      parameters:
 *          - name: id
 *            description: Id du signalement
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Récupère un signalement à partir de son id
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Report'
 *          400:
 *              $ref: '#/components/responses/InvalidReportId'
 *          404:
 *              $ref: '#/components/responses/UnknowReportObject'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', ReportController.get);

/**
 * @swagger
 * /v1/report/{offset}&{limit}&{filter}:
 *  get:
 *      tags:
 *         - Signalement
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: offset
 *            description: Valeur du décalage
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: limit
 *            description: Nombre de données à retourner
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: filter
 *            description: Filter à appliquer sur les données
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Données filtrées avec limite et décalage
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              countWithoutLimit:
 *                                  type: integer
 *                                  description: Nombre d'éléments correspondant au filtre sans décalage ni limite
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Report'
 *          400:
 *              description: JWT, décalage, filtre ou limite invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidReportFilterData'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: Action non autorisée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, Authorization.mustBeAdmin, ReportController.filterWithOffsetLimit);

/**
 * @swagger
 * /v1/report/filter/{offset}&{limit}:
 *  get:
 *      tags:
 *         - Signalement
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: offset
 *            description: Valeur du décalage
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: limit
 *            description: Nombre de données à retourner
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Données avec limite et décalage
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              countWithoutLimit:
 *                                  type: integer
 *                                  description: Nombre d'éléments correspondant au filtre sans décalage ni limite
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Report'
 *          400:
 *              description: JWT, décalage, filtre ou limite invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidReportFilterData'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: Action non autorisée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit", JWTMiddleware.identification, Authorization.mustBeAdmin, ReportController.filterWithOffsetLimit);

/**
 * @swagger
 * /v1/report/filter/{filter}:
 *  get:
 *      tags:
 *         - Signalement
 *      parameters:
 *          - name: filter
 *            description: Filtre à appliquer sur les données
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Données filtrées
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Report'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:filter", ReportController.filter);

/**
 * @swagger
 * /v1/report/foruser/{userId}:
 *  get:
 *      tags:
 *         - Signalement
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: userId
 *            description: Id de l'utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: Liste des signalements pour un utilisateur
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Report'
 *          400:
 *              description: JWT, décalage, filtre ou limite invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidReportId'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowReport'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/foruser/:userId', JWTMiddleware.identification, Authorization.canGetReportsForUser, ReportController.getWithUserId);

/**
 * @swagger
 * /v1/report:
 *  post:
 *      tags:
 *          - Signalement
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ReportToAdd'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ReportAdded'
 *          400:
 *              description: JWT invalide ou données manquantes dans le body
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/MissingReportBodyData'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          404:
 *              $ref: '#/components/responses/UnknowReportTypeOrCreator'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', JWTMiddleware.identification, ReportController.post);

/**
 * @swagger
 * /v1/report:
 *  patch:
 *      tags:
 *          - Signalement
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ReportToPatch'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ReportPatched'
 *          400:
 *              description: JWT invalide ou données manquantes dans le body
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/MissingReportBodyData'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowReportOrReportTypeOrEvent'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', JWTMiddleware.identification, Authorization.canDoActionOnReport, ReportController.patch);

/**
 * @swagger
 * /v1/report:
 *  delete:
 *      tags:
 *          - Signalement
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
 *                              description: Id du signalement à supprimer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ReportDeleted'
 *          400:
 *              description: JWT invalide ou id du signalement invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/InvalidReportId'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowReport'
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnReport, ReportController.delete);

module.exports = router;