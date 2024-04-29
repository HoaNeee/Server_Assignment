const express = require('express');

const Order = require('../models/orderModel');
const Cart = require('../models/cartModel')

const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');

const router = express.Router();
//GET 
router.get('/', async(req, res) => {
    // try {
    //     const orders = await Order.find();
        
    //     res.json(orders);
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({message: error});
    // }

    const userId = req.header("userId");
    try {
        const orders = await Order.find({UserID: userId});
        if(!orders || orders.length === 0){
            return res.status(200).json([]);
        }

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
});

//POST tạo đơn hàng
router.post('/', async (req, res) => {
    const userId = req.header("userId");

    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        // Lấy giỏ hàng của người dùng hiện tại
        const carts = await Cart.find({ UserID: userId });
        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: 'Không có giỏ hàng nào được tìm thấy.' });
        }
        
        const orderItems = [];
        let totalMoney = 0;
        // Lặp qua danh sách các giỏ hàng và thêm các mục vào đơn hàng
        carts.forEach(cart => {
            orderItems.push({
                nameFood: cart.nameFood,
                quantity: cart.quantity
            });
            totalMoney += cart.priceFood
        });
        
        // Tạo một đơn hàng mới bằng cách sao chép thông tin từ giỏ hàng
        const newOrder = new Order({
            OrdersID: uuidv4(),
            OrderID: uuidv4(),
            UserID: userId,
            nameUser: user.Name,
            phoneUser: user.Phone,
            addressUser: user.Address,
            Date: new Date(),
            totalMoney: totalMoney,
            items: orderItems,
            status: 0 // Trạng thái mặc định của đơn hàng (chưa thanh toán)
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đơn hàng.', error });
    }
});


router.post('/confirm/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        // Tìm đơn hàng dựa trên ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }

        order.status = 1;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xác nhận đơn hàng.', error });
    }
});

router.post('/cancel/:id', async (req, res) =>{

    const orderId = req.params.id;

    try {

        const order = await Order.findById(orderId);
 
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }

        order.status = 2;
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Xảy ra lỗi khi hủy đơn hàng'});
    }
});

router.post('/clear-cart', async (req, res) => {

    const userId = req.header("userId");

    try {
        // Tìm và xóa tất cả các sản phẩm trong giỏ hàng của người dùng dựa trên userId
        await Cart.deleteMany({ UserID: userId });

        res.status(200).json({ message: 'Xóa các sản phẩm trong giỏ hàng thành công.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa sản phẩm trong giỏ hàng.', error });
    }
});

module.exports = router;