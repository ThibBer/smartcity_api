const UserController = require("../../controller/v1/user");
const router = require("express").Router();

router.get('/:id', UserController.get);
router.get('/', UserController.all);
router.post('/', UserController.post);
router.patch('/', UserController.patch);
router.delete('/', UserController.delete);

module.exports = router;