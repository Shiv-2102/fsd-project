// models/ContactQuery.js

const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    message: { type: String, required: true },
});

const ContactQuery = mongoose.model('ContactQuery', contactQuerySchema);

module.exports = ContactQuery;
