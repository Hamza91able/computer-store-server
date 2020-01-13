const Categories = require('../models/categories');
const AppbarCategories = require('../models/appbarCategories');

exports.getCategories = (req, res, next) => {

    Categories
        .find()
        .sort('name')
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

exports.getSubCategoriesAndBrands = (req,res,next) => {
    const parentCategory = req.params.category;

    Categories
        .findOne({name: parentCategory})
        .then(category => {
            res.status(200).json({
                subCategories: category.subCategories,
                brands: category.brands,
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal Server Error",
            })
        })
}

exports.getAppbarCategories = (req, res, next) => {

    AppbarCategories
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

