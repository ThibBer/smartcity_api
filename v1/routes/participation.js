const Router = require("express-promise-router");
const router = new Router;

const ParticipationController = require("../controller/participation");
const Authorization = require("../middleware/Authorization");
const JWTMiddleware = require("../middleware/JWTIdentification");

router.get('/:participant&:event', JWTMiddleware.identification, ParticipationController.get);

/**
 * @swagger
 * /participation:
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
 * /participation:
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