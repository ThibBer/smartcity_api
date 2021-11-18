const ParticipationController = require("../../controller/v1/participation");
const router = require("express").Router();

router.get('/:participant&:event', ParticipationController.get);
router.get('/', ParticipationController.all);
router.post('/', ParticipationController.post);
router.delete('/', ParticipationController.delete);

module.exports = router;