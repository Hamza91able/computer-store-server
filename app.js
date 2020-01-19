const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const uuidv4 = require('uuid/v4')
const CronJob = require('cron').CronJob;
const moment = require('moment');
const helmet = require('helmet');

const databaseConfiguration = require('./utilities/database');

const adminRoutes = require('./routes/admin');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');

const Product = require('./models/products');

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

app.use(helmet());

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

const endSale = new CronJob('0 */10 * * * *', function () {
    const d = new Date().toISOString();
    console.log(`Checking if any sale's need to end. Every 10 Minutes: ${d}`);

    Product
        .find({ onSale: true })
        .then(products => {
            if (products.length > 0)
                products.forEach(product => {
                    if (d >= moment(product.saleEndDate).toISOString()) {
                        product.saleEndDate = null;
                        product.onSale = false;
                        product.discountPercentage = null;
                        product.priceAfterDiscount = null;
                        console.log("Sale Ended for ", product.title);
                        product.save();
                    } else {
                        console.log("Sale not ended for ", product.title);
                    }
                })
        })
});
endSale.start();

mongoose
    .connect(databaseConfiguration.connectionString, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        console.log("Connected");
        app.listen(process.env.PORT || 8080);
    })
    .catch(err => {
        console.log(err);
    })
