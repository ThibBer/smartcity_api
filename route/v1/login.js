const LoginController = require("../../controller/v1/loginDB");
const router = require("express").Router();

router.post('/', LoginController.login);

module.exports = router;