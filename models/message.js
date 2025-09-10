const mongoose = require('mongoose');

const message = mongoose.Schema({
    from: String,
    to: String,
    message: String,
    timestamp: Date
});

module.exports = mongoose.model('message' , message);