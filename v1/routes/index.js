const UserRouter = require('./user');
const ReportRouter = require('./report');
const ReportTypeRouter = require('./reportType');
const EventRouter = require('./event');
const ParticipationRouter = require('./participation');
const LoginRouter = require('./login');

const JWTMiddleware = require("../middleware/JWTIdentification");

const router = require("express").Router();

router.use("/event", EventRouter);
router.use("/login", LoginRouter);
router.use("/participation", JWTMiddleware.identification, ParticipationRouter);
router.use("/report", ReportRouter);
router.use("/reportType", ReportTypeRouter);
router.use("/user", UserRouter);

module.exports = router;