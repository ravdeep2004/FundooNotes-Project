const User = require('../models/user.model');

const registerUser = async (userData) => {
    return await User.create(userData);
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) return user;
    return null;
};

const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

const getUserById = async (id) => {
    return await User.findById(id);
};

module.exports = { registerUser, loginUser, findUserByEmail, getUserById };