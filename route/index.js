const Router = require("express-promise-router");
const router = new Router;
const v1Router = require("./v1");

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
});

router.use("/v1", v1Router);

module.exports = router;
