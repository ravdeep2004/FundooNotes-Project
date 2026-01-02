const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Label', labelSchema);