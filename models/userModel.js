const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true,
        unique: true
    },
    Name:{
        type: String,
        required: true
    },
    Email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    Password: { 
        type: String, 
        required: true 
    },
    Description: String,

    Address: String,

    Phone: String,

    ImageUser: String

});

const User = mongoose.model('user', userSchema);

module.exports = User;