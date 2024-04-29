const express = require('express');
const {v4 : uuidv4} = require('uuid');

const Cart = require('../models/cartModel');
const Food = require('../models/foodmodels');
const User = require('../models/userModel');

const router = express.Router();

router.get('/', async (req, res) => {
    // try {
    //     const carts = await Cart.find(); // Lấy danh sách các cart từ CSDL

    //     // Trả về danh sách giỏ hàng
    //     res.json(carts);
    // } catch (err) {
    //     res.status(500).json({ message: err.message });
    // }
    const  userId  = req.header("userId");
    try {
        //Tìm tất cả các món ăn trong giỏ hàng của người dùng
        const cartItems = await Cart.find({ UserID: userId });
        //Kiểm tra xem có giỏ hàng nào được tìm thấy không
        if (!cartItems || cartItems.length === 0) {
            return res.status(200).json([]);
        }
        // Trả về danh sách các món ăn trong giỏ hàng của người dùng
        res.status(200).json(cartItems);

    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách món ăn trong giỏ hàng', error });
    }
});

// Endpoint để tính tổng số tiền trong giỏ hàng
router.get('/total-money', async (req, res) => {
    const userId = req.header("userId");

    try {
        // Tìm tất cả các món ăn trong giỏ hàng của người dùng
        const cartItems = await Cart.find({ UserID: userId });
        
        // Tính tổng tiền của tất cả các món ăn trong giỏ hàng
        let totalMoney = 0;
        cartItems.forEach(item => {
            totalMoney += item.priceFood;
        });

        // Trả về tổng tiền
        res.status(200).json({totalMoney: totalMoney });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi tính tổng tiền.', error });
    }
});
// Endpoint để thêm một món ăn vào giỏ hàng
router.post('/', async (req, res) => {
    const userId = req.header("userId");

    const {foodId, quantity } = req.body;

    try {
        
        // Kiểm tra xem món ăn đã tồn tại trong giỏ hàng của người dùng hay chưa
        let cartItem = await Cart.findOne({ Food_id: foodId, UserID: userId });

        const food = await Food.findById(foodId);

        const user = await User.findById(userId)

        if (!food) {
            //console.log(foodId);
            return res.status(404).json({ message: 'Món ăn không tồn tại trong cơ sở dữ liệu' });
        }
        if (!user) {
            //console.log(foodId);
            return res.status(404).json({ message: 'Người dùng không tồn tại trong cơ sở dữ liệu' });
        }
        if (cartItem) {
            // Nếu món ăn đã tồn tại trong giỏ hàng, cập nhật số lượng
            cartItem.quantity += 1;
            cartItem.priceFood += food.price;
            await cartItem.save();
        } else {
            // Nếu món ăn chưa tồn tại trong giỏ hàng, tạo một bản ghi mới
                cartItem = new Cart({
                    CartID: uuidv4(),
                    Food_id: foodId,
                    UserID: userId,
                    quantity: quantity,
                    nameFood: food.name, 
                    priceFood: food.price,
                    imageFood: food.image,
                });
                
                await cartItem.save();
            
        }
        console.log(cartItem);
        //console.log(imageFood);
        res.status(201).json({ message: 'Món ăn đã được thêm vào giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: "Lỗi", error: error.message });
    }
});

router.put('/quantity/:id', async (req, res) => {

    const cartItemId = req.params.id;

    const { quantity } = req.body;

    try {
        // Kiểm tra xem món ăn có tồn tại trong giỏ hàng không
        let cartItem = await Cart.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Món ăn không tồn tại trong giỏ hàng' });
        }

        cartItem.quantity = quantity;
        
        const food = await Food.findById(cartItem.Food_id);
        if (!food) {
            return res.status(404).json({ message: 'Món ăn không tồn tại trong cơ sở dữ liệu' });
        }
        cartItem.priceFood = quantity * food.price;
        
        await cartItem.save();

        res.status(200).json({ message: 'Số lượng của món ăn đã được cập nhật trong giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    
    try {
        
        const cartItemId = req.params.id;
        const deletedCartItem = await Cart.findByIdAndDelete(cartItemId);
        if (!deletedCartItem) {
            return res.status(404).json({ message: 'Không tìm thấy món ăn trong giỏ hàng' });
        }
        res.status(200).json({ message: 'Món ăn đã được xóa khỏi giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
});


module.exports = router;
