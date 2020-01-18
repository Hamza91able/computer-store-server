const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bannerPicturesSchema = new Schema({
    src: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model("BannerPictures", bannerPicturesSchema);