const LoginController = require("../../controller/v1/login");
const Router = require("express-promise-router");
const router = new Router;

router.post('/', LoginController.login);

module.exports = router;