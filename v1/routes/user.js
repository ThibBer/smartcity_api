const Router = require("express-promise-router");
const router = new Router;

const UserController = require("../controller/user");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

/**
 * @swagger
 * /user/{id}:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: Id
 *            description: Id d'un utilisateur
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: '#/components/schemas/UserWithoutPassword'
 *          400:
 *              description: JWT not valid or JSON body not correct
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidUserBody'
 *                              - $ref: '#/components/responses/EmailAlreadyExist'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', JWTMiddleware.identification, UserController.get);

router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, UserController.filterWithOffsetLimit);
router.get("/filter/:offset&:limit", JWTMiddleware.identification, UserController.filterWithOffsetLimit);
router.get("/filter/:filter", JWTMiddleware.identification, UserController.filter);

/**
 * @swagger
 * /user:
 *  post:
 *      tags:
 *          - User
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToAdd'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/UserAdded'
 *          400:
 *              $ref: '#/components/responses/InvalidUserBody'
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
router.patch('/', JWTMiddleware.identification, Authorization.canDoActionOnUser, UserController.patch);
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnUser, UserController.delete);

module.exports = router;