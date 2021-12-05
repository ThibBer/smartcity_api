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
 *              description: JWT, décalage ou limite manquant
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/MissingUserBodyData'
 *                              - $ref: '#/components/responses/EmailAlreadyExist'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get('/:id', JWTMiddleware.identification, UserController.get);

/**
 * @swagger
 * /user/filter/{offset}&{limit}&{filter}:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
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
 *              $ref: '#/components/responses/ValidUserFilter'
 *          400:
 *              description: JWT, décalage, filtre ou limite invalide
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidUserFilterData'
 *          401:
 *              $ref: '#/components/responses/MissingJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, UserController.filterWithOffsetLimit);

/**
 * @swagger
 * /user/filter/{offset}&{limit}:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
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
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ValidUserFilter'
 *              description: JWT not valid or JSON body missing data or User email already exists
 *              content:
 *                  application/json:
 *                      schema:
 *                          oneOf:
 *                              - $ref: '#/components/responses/ErrorJWT'
 *                              - $ref: '#/components/responses/InvalidUserFilterData'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:offset&:limit", JWTMiddleware.identification, UserController.filterWithOffsetLimit);

/**
 * @swagger
 * /user/filter/{filter}:
 *  get:
 *      tags:
 *         - User
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: Filter
 *            description: Filter à appliquer sur les données
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ValidUserFilter'
 *          400:
 *              description: JWT not valid or JSON body missing data or User email already exists
 *              $ref: '#/components/responses/ErrorJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
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
 *              $ref: '#/components/responses/MissingUserBodyData'
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
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/schemas/User'
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

/**
 * @swagger
 * /user:
 *  delete:
 *      tags:
 *          - User
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
 *                              description: Id de l'utilisateur à supprimer
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
 *          404:
 *              $ref: '#/components/responses/InvalidUserId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnUser, UserController.delete);

module.exports = router;