const router = require('express').Router();
router.use('/users', require('./user.route'));
router.use('/notes', require('./note.route'));
router.use('/labels', require('./label.route'));
module.exports = router;