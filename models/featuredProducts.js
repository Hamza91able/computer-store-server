const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const featuredProductSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

module.exports = mongoose.model("FeaturedProductSchema", featuredProductSchema);