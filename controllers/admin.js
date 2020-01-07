const Categories = require('../models/categories');

exports.addCategory = (req, res, next) => {
    const categoryName = req.body.name;

    const category = new Categories({
        name: categoryName,
    })

    Categories
        .findOne({ name: categoryName })
        .then(cat => {
            if (!cat) {
                category
                    .save()
                    .then(resut => {
                        res.status(201).json({
                            message: "Category Added",
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: "Internal Server Error"
                        })
                    })
            } else {
                res.status(200).json({
                    message: "Category Already Exists"
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error"
            })
        })
}