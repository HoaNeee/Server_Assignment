const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs'); // Thư viện để mã hóa mật khẩu
const User = require('../models/userModel'); // Import model User

const { v4: uuidv4 } = require('uuid');

// tai len hinh anh
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});

// Route để render trang đăng nhập
router.get('/login', (req, res) => {
    res.render('login');
});

// Route để xử lý yêu cầu đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu bằng email
        const user = await User.findOne({ Email: email });

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // So sánh mật khẩu được nhập với mật khẩu trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không chính xác.' });
        }

        // Đăng nhập thành công, lưu thông tin người dùng vào session
        req.session.user = user;
        //console.log(req.session.user);
        //res.json({ message:"login thanh cong" });
        res.json(user);
        //res.redirect('/'); // Chuyển hướng đến trang chính hoặc trang dashboard sau khi đăng nhập thành công
    } catch (error) {
        console.error(error);
        
        res.status(500).json({ message:"Lỗi", error });
    }
});



// Route để render trang đăng ký
router.get('/register', (req, res) => {
    res.render('register');
});

// Route để xử lý yêu cầu đăng ký
router.post('/register', upload.single('avt') , async (req, res) => {

    const { Name, Email, Password, Phone, Address} = req.body;

    try {
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        let user = await User.findOne({ Email: Email });

        if (user) {
            return res.status(400).json({ message: 'Email đã được sử dụng. Vui lòng chọn một email khác.' });
        }
        
        if (!Password) {
            return res.status(400).json({ message: 'Mật khẩu không được để trống.' });
        }
        
        // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
        const hashedPassword = await bcrypt.hash(Password, 10); // Sử dụng bcrypt để mã hóa mật khẩu với salt 10

        const userID = uuidv4();

        const imagePath = req.file ? req.file.filename: null;

        // Tạo một bản ghi mới cho người dùng
        user = new User({
            UserID: userID,
            Name: Name,
            Email: Email,
            Password: hashedPassword,
            Phone: Phone,
            Address: Address,
            ImageUser: imagePath
        });


        await user.save(); // Lưu người dùng vào cơ sở dữ liệu

        res.status(201).json({ message: 'Tạo thành công tài khoản' });
        
        //res.redirect('/user/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
    } catch (error) {
        console.error(error);
        res.status(500).json( {message: error });
    }
});

router.put('/:id',upload.single('avt'), async (req, res) => {
    try {
        const userId = req.params.id;

        const updatedUserInfo = req.body; 

        const imagePath = req.file ? req.file.filename : null;
        // Tìm user theo ID
        const user = await User.findByIdAndUpdate(userId, updatedUserInfo,{new:true});
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Cập nhật thông tin người dùng
        user.Name = updatedUserInfo.Name;
        user.Email = updatedUserInfo.Email;
        user.Phone = updatedUserInfo.Phone;
        user.Address = updatedUserInfo.Address;
        user.ImageUser = imagePath;
        await user.save();
        
        //console.log(user);
        res.status(200).json(user);
        //res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
    }
});

router.put('/without-image/:id', async (req, res) => {
    
    try {
        const userId = req.params.id;

        const updatedUserInfo = req.body; 

        if (!updatedUserInfo.Name ) {
            return res.status(404).json({ message: 'Vui lòng cung cấp tên.' });
        }
        else if(!updatedUserInfo.Email){
            return res.status(404).json({ message: 'Vui lòng cung cấp email.' });
        }
        // Tìm user theo ID
        const user = await User.findByIdAndUpdate(userId, {
            Name: updatedUserInfo.Name,
            Email: updatedUserInfo.Email,
            Phone: updatedUserInfo.Phone,
            Address: updatedUserInfo.Address,
        }, { new: true });
        
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        //console.log(user);
        res.status(200).json(user);
        //res.status(200).json({ message: 'Cập nhật thông tin người dùng thành công' });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin người dùng:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng' });
    }
});

router.post('/logout', (req, res) => {
    // Xóa thông tin người dùng khỏi session
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng xuất.' });
        } else {
            // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng xuất thành công
            res.status(200).json({ message: 'Đã đăng xuất' });
        }
    });
});

router.get('/profile', async (req, res) => {
    try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
        }
        res.json(user);
        console.log(req.session.user._id);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy thông tin người dùng.', error });
    }
});

function authenticate (req, res, next) {
    if(!req.session.user){
        res.status(401).json({message: 'người dùng chưa đăng nhập'});
    }

    req.user = req.session.user;
    next();
}
module.exports = router;