const Categories = require('../models/categories');

exports.getCategories = (req, res, next) => {

    Categories
        .find()
        .then(categories => {
            res.status(200).json({
                categories,
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Internal Server Error",
            })
        })
}
