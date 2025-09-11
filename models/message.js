const mongoose = require('mongoose');

const message = mongoose.Schema({
    from: String,
    to: { type: String, required: true },
    message: String,
    timestamp: Date,
    delivered:Boolean,
    read:Boolean
});

module.exports = mongoose.model('Message' , message);