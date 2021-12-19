const Router = require("express-promise-router");
const router = new Router;

const UserController = require("../controller/user");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

/**
 * @swagger
* /v1/user/{Id}:
 *  get:
 *      tags:
 *         - Utilisateur
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
 *              $ref: '#/components/schemas/Utilisateur'
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
router.get('/:id', JWTMiddleware.identification, Authorization.canGetUser, UserController.get);

/**
 * @swagger
* /v1/user/filter/{Offset}&{Limit}&{Filter}:
 *  get:
 *      tags:
 *         - Utilisateur
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
 *              description: Utilisateurs correspondant au filtre, à la limite et au décalage
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              countWithoutLimit:
 *                                  type: integer
 *                                  description: Nombre d'éléments correspondant au filtre, à la limite et au décalage
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Utilisateur'
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
router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, Authorization.mustBeAdmin, UserController.filterWithOffsetLimit);

/**
 * @swagger
* /v1/user/filter/{Offset}&{Limit}:
 *  get:
 *      tags:
 *         - Utilisateur
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
 *          400:
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
router.get("/filter/:offset&:limit", JWTMiddleware.identification, Authorization.mustBeAdmin, UserController.filterWithOffsetLimit);

/**
 * @swagger
* /v1/user/filter/{filter}:
 *  get:
 *      tags:
 *         - Utilisateur
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: filter
 *            description: Filter à appliquer sur les données
 *            in: path
 *            required: true
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              $ref: '#/components/responses/ValidUserFilter'
 *          400:
 *              $ref: '#/components/responses/ErrorJWT'
 *          500:
 *              description: Erreur serveur
 *
 */
router.get("/filter/:filter", JWTMiddleware.identification, Authorization.mustBeAdmin, UserController.filter);

/**
 * @swagger
* /v1/user:
 *  post:
 *      tags:
 *          - Utilisateur
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
router.post('/', Authorization.canPostUser, UserController.post);

/**
 * @swagger
* /v1/user:
 *  patch:
 *      tags:
 *          - Utilisateur
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserToPatch'
 *      responses:
 *          204:
 *              $ref: '#/components/responses/UserUpdated'
 *          404:
 *              $ref: '#/components/responses/InvalidUserId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.patch('/', JWTMiddleware.identification, Authorization.canPatchUser, UserController.patch);

/**
 * @swagger
* /v1/user:
 *  delete:
 *      tags:
 *          - Utilisateur
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
 *              $ref: '#/components/responses/UserDeleted'
 *          404:
 *              $ref: '#/components/responses/InvalidUserId'
 *          500:
 *              description: Erreur serveur
 *
 */
router.delete('/', JWTMiddleware.identification, Authorization.canDeleteUser, UserController.delete);

module.exports = router;