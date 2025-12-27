const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);