const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subCategories: {
        type: Array,
        required: false,
    },
    brands: {
        type: Array,
        required: false,
    }
});

module.exports = mongoose.model("Categories", categoriesSchema);