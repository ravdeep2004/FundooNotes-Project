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

const getArchivedNotes = async (req, res, next) => {
    try {
        const notes = await noteService.getArchivedNotes(req.user._id);
        res.status(200).json({ success: true, data: notes });
    } catch (err) { next(err); }
};

const getTrashedNotes = async (req, res, next) => {
    try {
        const notes = await noteService.getTrashedNotes(req.user._id);
        res.status(200).json({ success: true, data: notes });
    } catch (err) { next(err); }
};

const toggleArchive = async (req, res, next) => {
    try {
        const note = await noteService.toggleArchive(req.params.id, req.user._id);
        if (!note) { res.status(404); throw new Error('Note not found'); }
        res.status(200).json({ success: true, data: note });
    } catch (err) { next(err); }
};

const toggleTrash = async (req, res, next) => {
    try {
        const note = await noteService.toggleTrash(req.params.id, req.user._id);
        if (!note) { res.status(404); throw new Error('Note not found'); }
        res.status(200).json({ success: true, data: note });
    } catch (err) { next(err); }
};

const togglePin = async (req, res, next) => {
    try {
        const note = await noteService.togglePin(req.params.id, req.user._id);
        if (!note) { res.status(404); throw new Error('Note not found'); }
        res.status(200).json({ success: true, data: note });
    } catch (err) { next(err); }
};

const searchNotes = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) { res.status(400); throw new Error('Search query required'); }
        const notes = await noteService.searchNotes(req.user._id, q);
        res.status(200).json({ success: true, data: notes });
    } catch (err) { next(err); }
};

const searchByLabel = async (req, res, next) => {
    try {
        const notes = await noteService.searchByLabel(req.user._id, req.params.labelId);
        res.status(200).json({ success: true, data: notes });
    } catch (err) { next(err); }
};

const addCollaborator = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) { res.status(400); throw new Error('Email required'); }
        const note = await noteService.addCollaborator(req.params.id, req.user._id, email);
        if (!note) { res.status(404); throw new Error('Note not found'); }
        res.status(200).json({ success: true, data: note, message: 'Collaborator added' });
    } catch (err) { next(err); }
};

module.exports = {
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
};