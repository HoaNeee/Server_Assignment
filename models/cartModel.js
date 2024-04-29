const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const cartSchema = new mongoose.Schema({
    CartID: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true
    },
    Food_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'food',
        required: true
    },
    UserID:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    nameFood: { 
        type: String 
    },
    priceFood: { 
        type: Number 
    },
    imageFood: {
        type: String
    }
    
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;