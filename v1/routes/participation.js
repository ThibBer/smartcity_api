const Router = require("express-promise-router");
const router = new Router;

const ParticipationController = require("../controller/participation");
const Authorization = require("../middleware/Authorization");

router.get('/:participant&:event', ParticipationController.get);

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
 *          201:
 *              $ref: '#/components/responses/ParticipationAdded'
 *          404:
 *              $ref: '#/components/responses/InvalidParticipationId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', ParticipationController.post);

/**
 * @swagger
 * /participation:
 *  delete:
 *      tags:
 *          - Participation
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ParticipationDeleted'
 *          404:
 *              description: ID invalide
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', Authorization.canDoActionOnParticipation, ParticipationController.delete);

module.exports = router;