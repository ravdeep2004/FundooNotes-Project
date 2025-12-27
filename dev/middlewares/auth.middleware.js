const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (!token) { res.status(401); return next(new Error('No token')); }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) throw new Error();
        next();
    } catch (error) {
        res.status(401); next(new Error('Not authorized'));
    }
};
module.exports = { protect };