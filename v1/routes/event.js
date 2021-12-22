const EventController = require("../controller/event");
const Router = require("express-promise-router");
const router = new Router;

const Authorization = require("../middleware/Authorization");
const JWTMiddleware = require("../middleware/JWTIdentification");

/**
 * @swagger
* /v1/event/filter/{offset}&{limit}&{filter}:
 *  get:
 *      tags:
 *         - Événement
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
 *                                      $ref: '#/components/schemas/Evenement'
 *          400:
 *              description: JWT, décalage, filtre ou limite invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidEventFilterData'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, EventController.filter);

/**
 * @swagger
* /v1/event/filter/{offset}&{limit}:
 *  get:
 *      tags:
 *         - Événement
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
 *                                      $ref: '#/components/schemas/Evenement'
 *          400:
 *              description: JWT, décalage ou limite invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidEventFilterData'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit", JWTMiddleware.identification, EventController.filter);

/**
 * @swagger
* /v1/event/forreport/{reportId}:
 *  get:
 *      tags:
 *         - Événement
 *      parameters:
 *          - name: reportId
 *            description: Id de l'événement
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Événements liés au signalement
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/EvenementSimple'
 *          400:
 *              $ref: '#/components/responses/InvalidReportId'
 *          404:
 *              $ref: '#/components/responses/UnknowReport'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/forreport/:reportId', EventController.getWithReportId);

/**
 * @swagger
* /v1/event:
 *  post:
 *      tags:
 *          - Événement
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/EventToAdd'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/EventAdded'
 *          400:
 *              description: JWT invalide ou données manquantes dans le body
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/MissingEventBodyData'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowEventReportOrCreator'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', JWTMiddleware.identification, Authorization.canDoActionOnEvent, EventController.post);

/**
 * @swagger
* /v1/event:
 *  patch:
 *      tags:
 *          - Événement
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/EventToPatch'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/EventPatched'
 *          400:
 *              description: JWT invalide ou données manquantes dans le body
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/MissingEventBodyData'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowEventReportOrCreatorOrEvent'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', JWTMiddleware.identification, Authorization.canDoActionOnEvent, EventController.patch);

/**
 * @swagger
* /v1/event:
 *  delete:
 *      tags:
 *          - Événement
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
 *              $ref: '#/components/responses/EventDeleted'
 *          400:
 *              description: JWT invalide ou id de l'événement invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/MissingJWT'
 *                              - $ref: '#/components/responses/InvalidEventId'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/UnknowEvent'
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnEvent, EventController.delete);

module.exports = router;