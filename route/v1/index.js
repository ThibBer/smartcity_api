const UserRouter = require('./user');
const ReportRouter = require('./report');
const ReportTypeRouter = require('./reportType');
const EventRouter = require('./event');
const ParticipationRouter = require('./participation');
const LoginRouter = require('./login');

const JWTMiddleware = require("../../middleware/JWTIdentification");

const router = require("express").Router();

router.use("/user", JWTMiddleware.identification, UserRouter);
router.use("/report", JWTMiddleware.identification, ReportRouter);
router.use("/reportType", JWTMiddleware.identification, ReportTypeRouter);
router.use("/event", JWTMiddleware.identification, EventRouter);
router.use("/participation", JWTMiddleware.identification, ParticipationRouter);
router.use("/login", LoginRouter);

module.exports = router;