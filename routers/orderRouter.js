const express = require('express');

const Order = require('../models/orderModel');
const Cart = require('../models/cartModel')

const { v4: uuidv4 } = require('uuid');
const { default: mongoose } = require('mongoose');

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        // Lấy orderId từ URL
        const orderId = req.params.id;

        // Tìm đơn hàng trong cơ sở dữ liệu dựa trên orderId
        const order = await Order.findById(orderId);

        if (!order) {
            // Nếu không tìm thấy đơn hàng, trả về lỗi 404
            
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Nếu tìm thấy đơn hàng, hiển thị trang xác nhận đơn hàng
        res.render('order', { order: order });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tìm đơn hàng', error: error });
    }
});

router.post('/', async (req, res) => {
    try {
        // Lấy dữ liệu từ body của yêu cầu
        const { userId, items, totalAmount } = req.body;

        const parsedItems = JSON.parse(items);

        // Tạo một đơn hàng mới
        const order = new Order({
            OrdersID: uuidv4(),
            Users_id: userId, // Thêm người dùng vào đơn hàng
            total_money: totalAmount, // Thêm tổng số tiền vào đơn hàng
            items:parsedItems, // Thêm các mặt hàng vào đơn hàng (chuyển đổi từ JSON sang JavaScript object)
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        await order.save();

        // Gửi phản hồi về cho client
        // res.status(201).json({ message: 'Đã tạo đơn hàng thành công', order: order });
        res.redirect('/order/' + order.id);
       
    } catch (error) {
        // Nếu có lỗi xảy ra, gửi phản hồi về client với thông báo lỗi
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi đặt hàng', error: error });
    }
});

module.exports = router;