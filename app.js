const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4')

const databaseConfiguration = require('./utilities/database');

const adminRoutes = require('./routes/admin');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');

const app = express();

const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        let extension = file.originalname.split('.').pop();
        cb(null, uuidv4() + '.' + extension)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).array('pictures'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/admin', adminRoutes);
app.use('/categories', categoriesRoutes)
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/order', orderRoutes);

mongoose
    .connect(databaseConfiguration.connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        console.log("Connected");
        app.listen(8080);
    })
    .catch(err => {
        console.log(err);
    })
