const Router = require("express-promise-router");
const router = new Router;

const ParticipationController = require("../controller/participation");
const Authorization = require("../middleware/Authorization");
const JWTMiddleware = require("../middleware/JWTIdentification");

/**
 * @swagger
* /v1/participation/{participant}&{event}:
 *  get:
 *      tags:
 *         - Participation
 *      parameters:
 *          - name: participant
 *            description: Id du participant à l'événement
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *          - name: event
 *            description: Id de l'événement
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Participation d'un utilisateur à un événement
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Participation'
 *          400:
 *              description: JWT, ou paramètre invalide dans l'url
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidParticipationParams'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          403:
 *              description: Action non autorisée
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:participant&:event', JWTMiddleware.identification, Authorization.canDoActionOnParticipation, ParticipationController.get);

/**
 * @swagger
* /v1/participation:
 *  post:
 *      tags:
 *          - Participation
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/ParticipationToAdd'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ParticipationAdded'
 *          400:
 *              $ref: '#/components/responses/MissingJWT'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              $ref: '#/components/responses/InvalidParticipationId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', JWTMiddleware.identification, Authorization.canDoActionOnParticipation, ParticipationController.post);

/**
 * @swagger
* /v1/participation:
 *  delete:
 *      tags:
 *          - Participation
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          204:
 *              $ref: '#/components/responses/ParticipationDeleted'
 *          400:
 *              $ref: '#/components/responses/MissingJWT'
 *          401:
 *              $ref: '#/components/responses/ErrorJWT'
 *          403:
 *              description: Action non autorisée
 *          404:
 *              description: ID invalide
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnParticipation, ParticipationController.delete);

module.exports = router;