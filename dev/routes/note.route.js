const router = require('express').Router();
const {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    getArchivedNotes,
    getTrashedNotes,
    toggleArchive,
    toggleTrash,
    togglePin,
    searchNotes,
    searchByLabel,
    addCollaborator
} = require('../controllers/note.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);
router.route('/').post(createNote).get(getNotes);
router.get('/search', searchNotes);
router.get('/archived', getArchivedNotes);
router.get('/trashed', getTrashedNotes);
router.get('/label/:labelId', searchByLabel);
router.route('/:id').get(getNote).put(updateNote).delete(deleteNote);
router.patch('/:id/archive', toggleArchive);
router.patch('/:id/trash', toggleTrash);
router.patch('/:id/pin', togglePin);
router.post('/:id/collaborator', addCollaborator);

module.exports = router;