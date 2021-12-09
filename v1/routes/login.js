const LoginController = require("../controller/login");
const Router = require("express-promise-router");
const router = new Router;

/**
 * @swagger
 * /login:
 *  post:
 *      tags:
 *          - Login
 *      requestBody:
 *          $ref: '#/components/requestBodies/UserCredentials'
 *      responses:
 *          200:
 *              $ref: '#/components/responses/LoggedIn'
 *          400:
 *              $ref: '#/components/responses/InvalidEmailOrPassword'
 *          404:
 *              $ref: '#/components/responses/BadCredentials'
 *          500:
 *              description: Erreur serveur
 *
 */
router.post('/', LoginController.login);

module.exports = router;