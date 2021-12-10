const EventController = require("../controller/event");
const Router = require("express-promise-router");
const router = new Router;

const Authorization = require("../middleware/Authorization");
const JWTMiddleware = require("../middleware/JWTIdentification");

router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, EventController.filter); /* Identification becasue user foreign key is object user */
router.get("/filter/:offset&:limit", JWTMiddleware.identification, EventController.filter); /* Identification becasue user foreign key is object user */

/**
 * @swagger
 * /forreport/{reportId}:
 *  get:
 *      tags:
 *         - Event
 *      parameters:
 *          - name: Id
 *            description: Id de l'événement
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Event'
 *          400:
 *              $ref: '#/components/responses/InvalidReportId'
 *          401:
 *              $ref: '#/components/responses/UnknowReport'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/forreport/:reportId', EventController.getWithReportId);

/**
 * @swagger
 * /event:
 *  post:
 *      tags:
 *          - Event
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
 * /event:
 *  patch:
 *      tags:
 *          - Event
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
 * /event:
 *  delete:
 *      tags:
 *          - Event
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