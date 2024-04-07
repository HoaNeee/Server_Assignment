const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid')

const cartSchema = new mongoose.Schema({
    Food_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'food',
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
    }
});

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;