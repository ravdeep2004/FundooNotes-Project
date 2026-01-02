const userService = require('../services/user.service');
const { generateToken } = require('../utils/token');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (await userService.findUserByEmail(email)) {
            res.status(400); throw new Error('User exists');
        }
        const user = await userService.registerUser({ firstName, lastName, email, password });
        logger.info(`Registered: ${user.email}`);
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                email: user.email,
                token: generateToken(user._id)
            }
        });
    } catch (err) { next(err); }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        if (!user) { res.status(401); throw new Error('Invalid creds'); }
        logger.info(`Login: ${user.email}`);
        res.json({ success: true, data: { ...user._doc, token: generateToken(user._id) } });
    } catch (err) { next(err); }
};

const forgotPassword = async (req, res, next) => {
    try {
        const user = await userService.findUserByEmail(req.body.email);
        if (!user) { res.status(404); throw new Error('User not found'); }
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.status(200).json({ success: true, data: { resetToken } });
    } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        if (!token) { res.status(400); throw new Error("Token required"); }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserById(decoded.id);
        if (!user) { res.status(404); throw new Error('User not found'); }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset' });
    } catch (err) { next(err); }
};

module.exports = { register, login, forgotPassword, resetPassword };