const EventController = require("../controller/event");
const Router = require("express-promise-router");
const router = new Router;

const Authorization = require("../middleware/Authorization");

router.get("/filter/:offset&:limit&:filter", EventController.filter);
router.get("/filter/:offset&:limit", EventController.filter);

router.get('/forreport/:reportId', EventController.getWithReportId);

router.post('/', EventController.post);
router.patch('/', Authorization.canDoActionOnEvent, EventController.patch);
router.delete('/', Authorization.canDoActionOnEvent, EventController.delete);

module.exports = router;