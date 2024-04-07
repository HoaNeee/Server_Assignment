
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const foodSchema = new mongoose.Schema({
    FoodID: { 
        type: String, 
        default: uuidv4,
        required: true, 
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

const Food = mongoose.model('food', foodSchema); 

module.exports = Food;