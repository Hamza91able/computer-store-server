const Categories = require('../models/categories');
const Products = require('../models/products');

exports.getProductByCategory = (req, res, next) => {
    const categoryName = req.params.categoryName;
    const order = req.params.order;
    let sort = 'price'
    if (order === '10') {
        sort = 'price'
    } else {
        sort = '-price'
    }
    let totalDocuments;

    Products
        .find({ category: categoryName })
        .countDocuments()
        .then(totalDocuments => {
            totalDocuments = totalDocuments;
            return Products
                .find({ category: categoryName })
                .sort(sort)
                .then(products => {
                    res.status(200).json({
                        products: products,
                        totalDocuments: totalDocuments
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error",
            });
        });
}

exports.getSpecificProduct = (req, res, next) => {
    const productId = req.params.id;

    Products
        .findById(productId)
        .then(product => {
            res.status(200).json({
                product: product,
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.getProductsBySubCategory = (req, res, next) => {
    const subCategoryName = req.params.name;
    const order = req.params.order;

    let sort = 'price'
    if (order === '10') {
        sort = 'price'
    } else {
        sort = '-price'
    }

    Products
        .find({ subCategory: subCategoryName })
        .countDocuments()
        .then(totalDocuments => {
            totalDocuments = totalDocuments;
            return Products
                .find({ subCategory: subCategoryName })
                .sort(sort)
                .then(products => {
                    res.status(200).json({
                        products: products,
                        totalDocuments: totalDocuments
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error",
            });
        });
}

exports.getProductsByBrands = (req, res, next) => {
    const brand = req.params.name;
    const order = req.params.order;

    let sort = 'price'
    if (order === '10') {
        sort = 'price'
    } else {
        sort = '-price'
    }

    Products
        .find({ brand: brand })
        .countDocuments()
        .then(totalDocuments => {
            totalDocuments = totalDocuments;
            return Products
                .find({ brand: brand })
                .sort(sort)
                .then(products => {
                    res.status(200).json({
                        products: products,
                        totalDocuments: totalDocuments
                    });
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Internal Server Error",
            });
        });
}
