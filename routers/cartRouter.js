const express = require('express');

const Cart = require('../models/cartModel');
const Food = require('../models/foodmodels');

const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const carts = await Cart.find(); // Lấy danh sách các cart từ CSDL

//         // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
//         const cartsWithFoodInfo = await Promise.all(carts.map(async cart => {
//             // Lấy thông tin món ăn từ CSDL bằng ID
//             const food = await Food.findById(cart.Food_id);
//             if (food) {
//                 // Trả về một object mới kết hợp thông tin món ăn và giỏ hàng
//                 return {
//                     ...cart.toObject(), // Convert cart thành một plain JavaScript object
//                     name: food.name,
//                     price: food.price,
//                     image: food.image // Giả sử có trường image trong đối tượng food
//                 };
//             }
//         }));

//         // Trả về kết quả
//         res.json(cartsWithFoodInfo);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// router.post('/', async (req, res) => {
//     const { //userId,
//          foodId, quantity } = req.body;

//     try {
//         // Kiểm tra xem món ăn đã tồn tại trong giỏ hàng của người dùng hay chưa
//         let cartItem = await Cart.findOne({Food_id: foodId });
        
//         if (cartItem) {
//             // Nếu món ăn đã tồn tại trong giỏ hàng, cập nhật số lượng
//             cartItem.quantity += quantity;
//             await cartItem.save();
//         } else {
//             // Nếu món ăn chưa tồn tại trong giỏ hàng, tạo một bản ghi mới
//             const food = await Food.findById(foodId);
//             if (food) {
//                 cartItem = new Cart({
//                     //Users_id: userId,
//                     Food_id: foodId,
//                     quantity: quantity,
//                     nameFood: food.name, // Thêm thông tin về tên và giá của món ăn vào giỏ hàng
//                     priceFood: food.price
//                 });
//                 await cartItem.save();
//             } else {
//                 // Trường hợp món ăn không tồn tại trong CSDL
//                 return res.status(404).json({ message: 'Không tìm thấy món ăn trong cơ sở dữ liệu' });
//             }
//         }

//         res.status(201).json({ message: 'Món ăn đã được thêm vào giỏ hàng' });

//         //res.redirect('/order')
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// router.get('/totalAmount', async (req, res) => {
//     try {
//         const cart = await Cart.findById(req.session.cartID).populate('items.Food');

//         let totalAmount = 0;

//         if (cart) {
//             cart.items.forEach(item => {
//                 totalAmount += item.Food.price * item.quantity;
//             });
//         }

//         res.json({ totalAmount: totalAmount });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });


router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find(); // Lấy danh sách các cart từ CSDL

        // Trả về danh sách giỏ hàng
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint để thêm một món ăn vào giỏ hàng
router.post('/', async (req, res) => {
    const { foodId, quantity } = req.body;

    try {
        // Kiểm tra xem món ăn đã tồn tại trong giỏ hàng của người dùng hay chưa
        let cartItem = await Cart.findOne({ Food_id: foodId });

        if (cartItem) {
            // Nếu món ăn đã tồn tại trong giỏ hàng, cập nhật số lượng
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // Nếu món ăn chưa tồn tại trong giỏ hàng, tạo một bản ghi mới
            
            const food = await Food.findById(foodId);
            if (food) {
                cartItem = new Cart({
                    Food_id: foodId,
                    quantity: quantity,
                    nameFood: food.name, // Thêm thông tin về tên của món ăn vào giỏ hàng
                    priceFood: food.price // Thêm thông tin về giá của món ăn vào giỏ hàng
                });
                await cartItem.save();
            } else {
                // Trường hợp món ăn không tồn tại trong CSDL
                
                return res.status(404).json({ message: 'Không tìm thấy món ăn trong cơ sở dữ liệu' });
            }
        }

        res.status(201).json({ message: 'Món ăn đã được thêm vào giỏ hàng' });
    } catch (error) {
        res.status(500).json("Lỗi",{ message: error.message });
    }
});

// Endpoint để tính tổng số tiền trong giỏ hàng
router.get('/totalAmount', async (req, res) => {
    try {
        const carts = await Cart.find();
        let totalAmount = 0;
        carts.forEach(cart => {
            totalAmount += cart.priceFood * cart.quantity;
        });
        res.json({ totalAmount: totalAmount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
