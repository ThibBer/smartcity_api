const router = require("express").Router();
const v1Router = require("./v1");

//TODO Peut-on garder ça ?
router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
router.use("/v1", v1Router);

module.exports = router;
