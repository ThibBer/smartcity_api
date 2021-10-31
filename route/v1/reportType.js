const ReportTypeController = require("../../controller/v1/reportType");
const router = require("express").Router();

router.get('/:id', ReportTypeController.get);
router.post('/', ReportTypeController.post);
router.patch('/', ReportTypeController.patch);
router.delete('/', ReportTypeController.delete);

module.exports = router;