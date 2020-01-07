const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const databaseConfiguration = require('./utilities/database');

const adminRoutes = require('./routes/admin');

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
