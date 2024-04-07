const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    OrdersID: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        unique: true 
    },
    Users_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    Date: { 
        type: Date, 
        default: Date.now 
    },
    total_money: { 
        type: Number, 
        required: true 
    },
    items: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'food' 
    }]
});

const Order = mongoose.model('order', orderSchema); 

module.exports = Order;