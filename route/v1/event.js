const EventController = require("../../controller/v1/event");
const Router = require("express-promise-router");
const router = new Router;

router.get("/filter/:offset&:limit&:filter", EventController.filter);
router.get("/filter/:offset&:limit", EventController.filter);

router.get('/forreport/:reportId', EventController.getWithReportId);
router.post('/', EventController.post);
router.patch('/', EventController.patch);
router.delete('/', EventController.delete);

module.exports = router;