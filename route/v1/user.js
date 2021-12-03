const Router = require("express-promise-router");
const router = new Router;

const UserController = require("../../controller/v1/user");

/**
 * @swagger
 * /user/{id}:
 *  get:
 *      tags:
 *         - User
 *      parameters:
 *          - name: id
 *            description: Id d'un utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserFound'
 *          404:
 *              $ref: '#/components/responses/InvalidUserId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', UserController.get);

router.get("/filter/:offset&:limit&:filter", UserController.filterWithOffsetLimit);
router.get("/filter/:offset&:limit", UserController.filterWithOffsetLimit);
router.get("/filter/:filter", UserController.filter);

/**
 * @swagger
 * /user:
 *  post:
 *      tags:
 *          - User
 *      security:
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToAdd'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserAdded'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', UserController.post);

/**
 * @swagger
 * /user:
 *  patch:
 *      tags:
 *          - User
 *      security:
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToUpdate'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
 *          404:
 *              $ref: '#/components/responses/InvalidUserId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', UserController.patch);
router.delete('/', UserController.delete);

module.exports = router;