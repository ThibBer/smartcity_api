const Router = require("express-promise-router");
const router = new Router;

const ReportController = require("../controller/report");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

router.get('/:id', JWTMiddleware.identification, ReportController.get);
router.get("/", ReportController.all);

router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, ReportController.filterWithOffsetLimit);
router.get("/filter/:offset&:limit", JWTMiddleware.identification, ReportController.filterWithOffsetLimit);

router.get("/filter/:filter", JWTMiddleware.identification, ReportController.filter);

router.get('/foruser/:userId', JWTMiddleware.identification, Authorization.canGetReportsForUser, ReportController.getWithUserId);

router.post('/', JWTMiddleware.identification, ReportController.post);
router.patch('/', JWTMiddleware.identification, Authorization.canDoActionOnReport, ReportController.patch);
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnReport, ReportController.delete);

module.exports = router;