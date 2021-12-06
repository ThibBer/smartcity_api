const EventController = require("../controller/event");
const Router = require("express-promise-router");
const router = new Router;

const Authorization = require("../middleware/Authorization");
const JWTMiddleware = require("../middleware/JWTIdentification");

router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, EventController.filter);
router.get("/filter/:offset&:limit", JWTMiddleware.identification, EventController.filter);

router.get('/forreport/:reportId', EventController.getWithReportId);

router.post('/', JWTMiddleware.identification, Authorization.canDoActionOnEvent, EventController.post);
router.patch('/', JWTMiddleware.identification, Authorization.canDoActionOnEvent, EventController.patch);
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnEvent, EventController.delete);

module.exports = router;