const LoginController = require("../controller/login");
const Router = require("express-promise-router");
const router = new Router;

router.post('/', LoginController.login);

module.exports = router;