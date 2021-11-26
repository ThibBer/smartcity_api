const ParticipationController = require("../../controller/v1/participation");
const router = require("express").Router();

router.get('/:participant&:event', ParticipationController.get);

/**
 * @swagger
 * /participation:
 *  get:
 *      tags:
 *         - Participation
 *      parameters:
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ParticipationsFound'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/', ParticipationController.all);

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
router.delete('/', ParticipationController.delete);

module.exports = router;