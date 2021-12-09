const Router = require("express-promise-router");
const router = new Router;

const ReportTypeController = require("../controller/reportType");
const JWTMiddleware = require("../middleware/JWTIdentification");
const Authorization = require("../middleware/Authorization");

router.get('/:id', ReportTypeController.get);
router.get("/", ReportTypeController.all);

router.get("/filter/:offset&:limit&:filter", ReportTypeController.filter);
router.get("/filter/:offset&:limit", ReportTypeController.filter);

router.post('/', JWTMiddleware.identification, Authorization.mustBeAdmin, ReportTypeController.post);
router.patch('/', JWTMiddleware.identification, Authorization.mustBeAdmin, ReportTypeController.patch);
router.delete('/', JWTMiddleware.identification, Authorization.mustBeAdmin, ReportTypeController.delete);

module.exports = router;