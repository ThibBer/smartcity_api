const ReportController = require("../../controller/v1/report");
const router = require("express").Router();

router.get('/:id', ReportController.get);
router.get('/', ReportController.all);

router.get("/filter/:offset&:limit&:filter", ReportController.filterWithOffsetLimit);
router.get("/filter/:offset&:limit", ReportController.filterWithOffsetLimit);

router.get("/filter/:filter", ReportController.filter);

router.get('/foruser/:userId', ReportController.getWithUserId);
router.post('/', ReportController.post);
router.patch('/', ReportController.patch);
router.delete('/', ReportController.delete);

module.exports = router;