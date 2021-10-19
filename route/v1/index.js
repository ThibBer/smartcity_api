const UserRouter = require('./user');
const ReportRouter = require('./report');

const router = require("express").Router();

router.use("/user", UserRouter);
router.use("/report", ReportRouter);

module.exports = router;