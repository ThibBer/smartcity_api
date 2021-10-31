const EventController = require("../../controller/v1/event");
const router = require("express").Router();

router.get('/:id', EventController.get);
router.get('/', EventController.all);
router.post('/', EventController.post);
router.patch('/', EventController.patch);
router.delete('/', EventController.delete);

module.exports = router;