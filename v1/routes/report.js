const Router = require("express-promise-router");
const router = new Router;

const ReportController = require("../controller/report");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");


router.get('/:id', ReportController.get);
router.get("/", ReportController.all);

router.get("/filter/:offset&:limit&:filter", JWTMiddleware.identification, Authorization.mustBeAdmin, ReportController.filterWithOffsetLimit);
router.get("/filter/:offset&:limit", JWTMiddleware.identification, Authorization.mustBeAdmin,ReportController.filterWithOffsetLimit);

router.get("/filter/:filter", ReportController.filter);

router.get('/foruser/:userId', JWTMiddleware.identification, Authorization.canGetReportsForUser, ReportController.getWithUserId);

router.post('/', JWTMiddleware.identification, ReportController.post);
router.patch('/', JWTMiddleware.identification, Authorization.canDoActionOnReport, ReportController.patch);
router.delete('/', JWTMiddleware.identification, Authorization.canDoActionOnReport, ReportController.delete);

module.exports = router;