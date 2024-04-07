const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const session = require('express-session'); 

const foodRouter = require('./routers/foodRouter');
const cartRouter = require('./routers/cartRouter');
const userRouter = require('./routers/userRouter');
const orderRouter = require('./routers/orderRouter');

const COMMON = require('./COMMON');
const uri = COMMON.uri

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: 'sieuhoadz', // Chuỗi bí mật để ký và mã hóa cookie session
    resave: false,
    saveUninitialized: true
}));

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('conected to mongodb'))
.catch(err => console.error('error conected to mongodb: ', err));

app.use('/',foodRouter);
app.use('/user', userRouter);
app.use('/cart',cartRouter);
app.use('/order',orderRouter);

//app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server dang chay o cong ${PORT}`));

