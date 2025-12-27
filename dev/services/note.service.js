const Note = require('../models/note.model');

// to create a note
const createNote = async (userId, body) => {
    return await Note.create({ ...body, user: userId });
};

// to get user notes
const getAllNotes = async (userId) => {
    return await Note.find({ user: userId }).sort({ createdAt: -1 });
};

// to search (get) note by ID
const getNoteById = async (id, userId) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    return note;
};

// to update note
const updateNote = async (id, userId, body) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    return await Note.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

// to delete note
const deleteNote = async (id, userId) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    await Note.findByIdAndDelete(id);
    return true;
};

module.exports = { createNote, getAllNotes, getNoteById, updateNote, deleteNote };