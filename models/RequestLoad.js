const mongoose = require('mongoose');

const requestLoadSchema = new mongoose.Schema({
    name: String,
    companyName: String,
    mcNumber: String,
    phoneNumber: String,
    email: String,
    truckType: String,
    zipCode: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestLoad', requestLoadSchema);
