const router = require('express').Router();
const { createLabel, getLabels, getLabel, updateLabel, deleteLabel } = require('../controllers/label.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.route('/').post(createLabel).get(getLabels);
router.route('/:id').get(getLabel).put(updateLabel).delete(deleteLabel);

module.exports = router;