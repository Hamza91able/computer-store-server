const Categories = require('../models/categories');
const Product = require('../models/products');

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

exports.postProduct = (req, res, next) => {
    console.log(req.files);
    const title = req.body.title;
    const category = req.body.category;
    const subCategory = req.body.subCategory;
    const brand = req.body.brand;
    const bulletPoints = req.body.values;
    const price = req.body.price;
    const stock = req.body.stock;
    const overview = req.body.overview;
    const specifications = req.body.specifications;
    const soldAndShippedBy = req.body.soldAndShippedBy;
    const shippingCost = req.body.shippingCost;
    const shippingInKarachi = req.body.shippingCostInKarachi;
    let imageUrls = [];
    req.files.forEach(file => {
        imageUrls.push(file.path.replace("\\", "/"));
    })
    console.log(imageUrls);
    

    const product = new Product({
        title,
        category,
        subCategory,
        brand,
        bulletPoints,
        price,
        stock,
        overview,
        specifications,
        soldAndShippedBy,
        shippingCost,
        shippingInKarachi
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Product saved in database',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        })
}
