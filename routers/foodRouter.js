const express = require('express');

const Food = require('../models/foodmodels');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const foods = await Food.find();
        let loggedIn = false;
        let username = '';
        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (req.session.user) {
            // Nếu đã đăng nhập, gán trạng thái đăng nhập và tên người dùng
            loggedIn = true;
            username = req.session.user.Name;
        }
        // Render trang chủ với dữ liệu tương ứng
        //res.render('index', { foods: foods, loggedIn: loggedIn, username: username });
        res.json(foods)
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

router.post('/', async (req, res) => {
    // Nhận dữ liệu từ request body
    const { name, description, price, image } = req.body;

    try {
        // Tạo một bản ghi mới trong cơ sở dữ liệu với các thông tin nhận được
        const newFood = new Food({
            name: name,
            description: description,
            price: price,
            image: image
        });

        // Lưu bản ghi mới vào cơ sở dữ liệu
        const savedFood = await newFood.save();

        // Trả về response với thông tin về món ăn đã được tạo mới
        res.status(201).json(savedFood);
    } catch (error) {
        // Nếu có lỗi xảy ra trong quá trình tạo mới món ăn, trả về thông báo lỗi
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;