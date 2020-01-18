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
    },
    discountPercentage: {
        type: Number,
        required: false,
    },
    priceAfterDiscount: {
        type: Number,
        required: false,
    },
    saleEndDate: {
        type: Date,
        required: false,
    },
    onSale: {
        type: Boolean,
        required: false,
    },
    averageRating: {
        type: Number,
        required: false
    },
    reviews: [
        {
            rating: {
                type: Number,
                required: false
            },
            title: {
                type: String,
                required: false
            },
            pros: {
                type: String,
                required: false
            },
            cons: {
                type: String,
                required: false
            },
            overallReview: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            postedOn: {
                type: Date,
                required: false
            },
            verifiedOwner: {
                type: Boolean,
                required: false
            },
            userId: {
                type: Schema.Types.ObjectId,
                required: false
            },
        }
    ]
});

module.exports = mongoose.model("Product", productSchema);