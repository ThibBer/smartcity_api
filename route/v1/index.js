const UserRouter = require('./user');
const ReportRouter = require('./report');
const ReportTypeRouter = require('./reportType');
const EventRouter = require('./event');
const ParticipationRouter = require('./participation');

const router = require("express").Router();

router.use("/user", UserRouter);
router.use("/report", ReportRouter);
router.use("/reportType", ReportTypeRouter);
router.use("/event", EventRouter);
router.use("/participation", ParticipationRouter);

module.exports = router;