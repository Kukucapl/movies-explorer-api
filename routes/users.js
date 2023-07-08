const router = require('express').Router();
const { getCurrentUser, updateProfile } = require('../controllers/users');
const { updateProfileValidator } = require('../validators/validators');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateProfileValidator, updateProfile);

module.exports = router;
