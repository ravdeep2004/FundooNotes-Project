const Label = require('../models/label.model');

const createLabel = async (userId, body) => {
    return await Label.create({ ...body, user: userId });
};

const getAllLabels = async (userId) => {
    return await Label.find({ user: userId }).sort({ createdAt: -1 });
};

const getLabelById = async (id, userId) => {
    const label = await Label.findById(id);
    if (!label || label.user.toString() !== userId.toString()) return null;
    return label;
};

const updateLabel = async (id, userId, body) => {
    const label = await Label.findById(id);
    if (!label || label.user.toString() !== userId.toString()) return null;
    return await Label.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

const deleteLabel = async (id, userId) => {
    const label = await Label.findById(id);
    if (!label || label.user.toString() !== userId.toString()) return null;
    await Label.findByIdAndDelete(id);
    return true;
};

module.exports = { createLabel, getAllLabels, getLabelById, updateLabel, deleteLabel };