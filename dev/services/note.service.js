const Note = require('../models/note.model');
const { redisClient } = require('../config/redis');
const { sendEmailNotification } = require('./email.service');
const logger = require('../utils/logger');

const CACHE_TTL = 3600;

const createNote = async (userId, body) => {
    const note = await Note.create({ ...body, user: userId });
    await redisClient.del(`notes:${userId}`);
    logger.info(`Cache invalidated for user: ${userId}`);
    return note;
};

const getAllNotes = async (userId) => {
    const cacheKey = `notes:${userId}`;

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            logger.info(`Cache hit for user: ${userId}`);
            return JSON.parse(cached);
        }
    } catch (error) {
        logger.error('Redis get error:', error);
    }

    const notes = await Note.find({ user: userId, isTrashed: false })
        .populate('labels')
        .sort({ isPinned: -1, createdAt: -1 })
        .limit(20);

    try {
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(notes));
        logger.info(`Cache set for user: ${userId}`);
    } catch (error) {
        logger.error('Redis set error:', error);
    }

    return notes;
};

const getNoteById = async (id, userId) => {
    const note = await Note.findById(id).populate('labels collaborators');
    if (!note || note.user.toString() !== userId.toString()) return null;
    return note;
};

const updateNote = async (id, userId, body) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    const updated = await Note.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    await redisClient.del(`notes:${userId}`);
    logger.info(`Cache invalidated for user: ${userId}`);
    return updated;
};

const deleteNote = async (id, userId) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    await Note.findByIdAndDelete(id);
    await redisClient.del(`notes:${userId}`);
    logger.info(`Cache invalidated for user: ${userId}`);
    return true;
};

const getArchivedNotes = async (userId) => {
    return await Note.find({ user: userId, isArchived: true, isTrashed: false })
        .populate('labels')
        .sort({ createdAt: -1 });
};

const getTrashedNotes = async (userId) => {
    return await Note.find({ user: userId, isTrashed: true })
        .populate('labels')
        .sort({ createdAt: -1 });
};

const toggleArchive = async (id, userId) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    note.isArchived = !note.isArchived;
    await note.save();
    await redisClient.del(`notes:${userId}`);
    return note;
};

const toggleTrash = async (id, userId) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    note.isTrashed = !note.isTrashed;
    await note.save();
    await redisClient.del(`notes:${userId}`);
    return note;
};

const togglePin = async (id, userId) => {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== userId.toString()) return null;
    note.isPinned = !note.isPinned;
    await note.save();
    await redisClient.del(`notes:${userId}`);
    return note;
};

const searchNotes = async (userId, query) => {
    const searchQuery = {
        user: userId,
        isTrashed: false,
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    };

    return await Note.find(searchQuery).populate('labels').sort({ createdAt: -1 });
};

const searchByLabel = async (userId, labelId) => {
    return await Note.find({ user: userId, labels: labelId, isTrashed: false })
        .populate('labels')
        .sort({ createdAt: -1 });
};

const addCollaborator = async (noteId, userId, collaboratorEmail) => {
    const User = require('../models/user.model');
    const note = await Note.findById(noteId);

    if (!note || note.user.toString() !== userId.toString()) return null;

    const collaborator = await User.findOne({ email: collaboratorEmail });
    if (!collaborator) throw new Error('User not found');

    if (note.collaborators.includes(collaborator._id)) {
        throw new Error('User already a collaborator');
    }

    note.collaborators.push(collaborator._id);
    await note.save();

    await sendEmailNotification({
        to: collaboratorEmail,
        subject: 'You have been added as a collaborator',
        message: `You have been invited to collaborate on note: ${note.title}`
    });

    return note;
};

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
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