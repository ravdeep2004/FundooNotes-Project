const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    isArchived: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    labels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

noteSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Note', noteSchema);