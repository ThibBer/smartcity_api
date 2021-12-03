const Router = require("express-promise-router");
const router = new Router;

const ReportTypeController = require("../../controller/v1/reportType");

router.get('/:id', ReportTypeController.get);

router.get("/filter/:offset&:limit&:filter", ReportTypeController.filter);
router.get("/filter/:offset&:limit", ReportTypeController.filter);

router.post('/', ReportTypeController.post);
router.patch('/', ReportTypeController.patch);
router.delete('/', ReportTypeController.delete);

module.exports = router;