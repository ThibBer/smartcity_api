const EventController = require("../../controller/v1/event");
const ReportController = require("../../controller/v1/report");
const router = require("express").Router();

router.get('/:id', EventController.get);
router.get('/', EventController.all);

router.get("/filter/:offset&:limit&:filter", EventController.filter);
router.get("/filter/:offset&:limit", EventController.filter);

router.get('/forreport/:reportId', EventController.getWithReportId);
router.post('/', EventController.post);
router.patch('/', EventController.patch);
router.delete('/', EventController.delete);

module.exports = router;