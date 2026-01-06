const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    filePath: { type: String, required: true },
    category: { type: String },
    semester: { type: String },
}, { timestamps: true });

const PDF = mongoose.model('PDF', pdfSchema);
module.exports = PDF;
