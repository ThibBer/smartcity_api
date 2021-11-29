const ReportController = require("../../controller/v1/report");
const UserController = require("../../controller/v1/user");
const router = require("express").Router();

router.get('/:id', ReportController.get);
router.get('/', ReportController.all);

router.get("/filter/:offset&:limit&:filter", ReportController.filter);
router.get("/filter/:offset&:limit", ReportController.filter);

router.get('/foruser/:userId', ReportController.getWithUserId);
router.post('/', ReportController.post);
router.patch('/', ReportController.patch);
router.delete('/', ReportController.delete);

module.exports = router;