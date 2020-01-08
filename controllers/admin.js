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

exports.addSubCategory = (req, res, next) => {
    const parentCategory = req.body.parentCategory;
    const subCategory = req.body.subCategory.toLowerCase();

    Categories
        .findOne({ name: parentCategory })
        .then(category => {
            if (category.subCategories.indexOf(subCategory) !== -1) {
                const error = new Error("Sub Category already exists");
                error.statusCode = 403;
                throw error;
            }

            category.subCategories.push(subCategory);
            return category.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Sub-Category Added",
            });
        })
        .catch(err => {
            if (err.statusCode === 403) {
                res.status(200).json({
                    message: 'Sub-Category already exists',
                })
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
        })
}

exports.addBrands = (req, res, next) => {
    const parentCategory = req.body.parentCategory;
    const brand = req.body.brand.toLowerCase();

    Categories
        .findOne({ name: parentCategory })
        .then(category => {
            if (category.brands.indexOf(brand) !== -1) {
                const error = new Error("Brand already exists");
                error.statusCode = 403;
                throw error;
            }

            category.brands.push(brand);
            return category.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Brand Added",
            });
        })
        .catch(err => {
            console.log(err);
            if (err.statusCode === 403) {
                res.status(200).json({
                    message: 'Brand already exists',
                })
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
        })
}
