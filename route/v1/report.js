const ReportController = require("../../controller/v1/report");
const router = require("express").Router();

router.get('/:id', ReportController.get);
router.post('/', ReportController.post);
router.patch('/', ReportController.patch);
router.delete('/', ReportController.delete);

module.exports = router;