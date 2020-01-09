const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: false,
    },
    brand: {
        type: String,
        required: false
    },
    bulletPoints: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    specifications: {
        type: String,
        required: false,
    },
    pictures: {
        type: Array,
        required: false
    },
    soldAndShippedBy: {
        type: String,
        required: true,
    },
    shippingCost: {
        type: Number,
        required: true,
    },
    shippingInKarachi: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Product", productSchema);