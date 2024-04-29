const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
    OrdersID: {
        type: String,
        default: uuidv4(),
        required: true,
        unique: true 
    },
    OrderID: {
        type: String,
        default: uuidv4(),
        required: true,
        unique: true 
    },
    UserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    CartID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        require: true
    },

    nameUser: String,

    phoneUser: String,

    addressUser: String,

    Date: {
        type: Date,
        default: Date.now
    },
    totalMoney: {
        type: Number,
        required: true
    },
    items: [{
        nameFood: { 
            type: String,
            required: true
        },
        quantity: { 
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        enum: [0,1,2], // Chuỗi cho phép là '0', '1' hoặc '2'
        default: 0// Giá trị mặc định là '0' (chưa thanh toán)
    }
});

const Order = mongoose.model('order', orderSchema); 

module.exports = Order;