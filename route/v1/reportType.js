const ReportTypeController = require("../../controller/v1/reportType");
const ReportController = require("../../controller/v1/report");
const router = require("express").Router();

router.get('/:id', ReportTypeController.get);
router.get('/', ReportTypeController.all);

router.get("/filter/:offset&:limit&:filter", ReportTypeController.filter);
router.get("/filter/:offset&:limit", ReportTypeController.filter);

router.post('/', ReportTypeController.post);
router.patch('/', ReportTypeController.patch);
router.delete('/', ReportTypeController.delete);

module.exports = router;