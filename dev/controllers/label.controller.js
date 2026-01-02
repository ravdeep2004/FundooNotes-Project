const labelService = require('../services/label.service');
const logger = require('../utils/logger');

const createLabel = async (req, res, next) => {
    try {
        const label = await labelService.createLabel(req.user._id, req.body);
        logger.info(`Label created: ${req.user._id}`);
        res.status(201).json({ success: true, data: label });
    } catch (err) { next(err); }
};

const getLabels = async (req, res, next) => {
    try {
        const labels = await labelService.getAllLabels(req.user._id);
        res.status(200).json({ success: true, data: labels });
    } catch (err) { next(err); }
};

const getLabel = async (req, res, next) => {
    try {
        const label = await labelService.getLabelById(req.params.id, req.user._id);
        if (!label) { res.status(404); throw new Error('Label not found'); }
        res.status(200).json({ success: true, data: label });
    } catch (err) { next(err); }
};

const updateLabel = async (req, res, next) => {
    try {
        const label = await labelService.updateLabel(req.params.id, req.user._id, req.body);
        if (!label) { res.status(404); throw new Error('Label not found'); }
        res.status(200).json({ success: true, data: label });
    } catch (err) { next(err); }
};

const deleteLabel = async (req, res, next) => {
    try {
        if (!await labelService.deleteLabel(req.params.id, req.user._id)) {
            res.status(404); throw new Error('Label not found');
        }
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) { next(err); }
};

module.exports = { createLabel, getLabels, getLabel, updateLabel, deleteLabel };