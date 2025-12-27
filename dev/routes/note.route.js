const router = require('express').Router();
const { createNote, getNotes, getNote, updateNote, deleteNote } = require('../controllers/note.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.route('/').post(createNote).get(getNotes);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);

module.exports = router;