const Router = require("express-promise-router");
const router = new Router;
const ReportController = require("../../controller/v1/report");

router.get('/:id', ReportController.get);

router.get("/filter/:offset&:limit&:filter", ReportController.filterWithOffsetLimit);
router.get("/filter/:offset&:limit", ReportController.filterWithOffsetLimit);

router.get("/filter/:filter", ReportController.filter);

router.get('/foruser/:userId', ReportController.getWithUserId);
router.post('/', ReportController.post);
router.patch('/', ReportController.patch);
router.delete('/', ReportController.delete);

module.exports = router;