const ReportController = require("../../controller/report");
const router = require("express").Router();

router.get('/:id', ReportController.getReport);
router.post('/', ReportController.postReport);
router.patch('/', ReportController.patchReport);
router.delete('/', ReportController.deleteReport);

module.exports = router;