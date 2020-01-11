const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: [
        {
            product: {
                type: Object, required: true,
            },
            quantity: {
                type: Number, required: true,
            }
        }
    ],
    user: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        fullName: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        delieveryInformation: {
            type: String,
            required: false,
        }
    },
    shippingCost: {
        type: Number,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    receipt: {
        type: String,
        required: false,
    }
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Order", orderSchema);