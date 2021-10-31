const ParticipationController = require("../../controller/v1/participation");
const router = require("express").Router();

router.get('/:id', ParticipationController.get);
router.post('/', ParticipationController.post);
router.delete('/', ParticipationController.delete);

module.exports = router;