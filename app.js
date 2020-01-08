const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const databaseConfiguration = require('./utilities/database');

const adminRoutes = require('./routes/admin');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/products');

const app = express();

app.use(bodyParser.json());

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
