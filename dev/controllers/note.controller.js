const noteService = require('../services/note.service');
const logger = require('../utils/logger');

const createNote = async (req, res, next) => {
    try {
        const note = await noteService.createNote(req.user._id, req.body);
        logger.info(`Note created: ${req.user._id}`);
        res.status(201).json({ success: true, data: note });
    } catch (err) { next(err); }
};

const getNotes = async (req, res, next) => {
    try {
        const notes = await noteService.getAllNotes(req.user._id);
        res.status(200).json({ success: true, data: notes });
    } catch (err) { next(err); }
};

const getNote = async (req, res, next) => {
    try {
        const note = await noteService.getNoteById(req.params.id, req.user._id);
        if (!note) { res.status(404); throw new Error('Note not found'); }
        res.status(200).json({ success: true, data: note });
    } catch (err) { next(err); }
};

const updateNote = async (req, res, next) => {
    try {
        const note = await noteService.updateNote(req.params.id, req.user._id, req.body);
        if (!note) { res.status(404); throw new Error('Note not found'); }
        res.status(200).json({ success: true, data: note });
    } catch (err) { next(err); }
};

const deleteNote = async (req, res, next) => {
    try {
        if (!await noteService.deleteNote(req.params.id, req.user._id)) {
            res.status(404); throw new Error('Note not found');
        }
        res.status(200).json({ success: true, message: 'Deleted' });
    } catch (err) { next(err); }
};

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };