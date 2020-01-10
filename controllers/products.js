const { validationResult } = require('express-validator');
const User = require('../models/user');
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

exports.postCart = (req, res, nxet) => {
    const errors = validationResult(req);
    const prodId = req.body.prodId;
    let quantity = req.body.quantity;
    if (!errors.isEmpty()) {
        console.log("Validation Failed");
        quantity = 1;
    }

    Products
        .findById(prodId)
        .then(product => {
            return User
                .findById(req.userId)
                .then(user => {
                    user.addToCart(product)
                    if (quantity > 1)
                        user.updateCartItemQuantity(product, quantity)
                })
        })
        .then(result => {
            res.status(201).json({
                message: 'Added to cart',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.getCart = (req, res, next) => {

    User
        .findById(req.userId)
        .then(user => {
            return user
                .populate('cart.items.productId')
                .execPopulate()
                .then(user => {
                    const products = user.cart.items;
                    res.status(200).json({
                        products: products
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.postDeleteFromCart = (req,res,next) => {
    const productId = req.body.prodId;

    User
        .findById(req.userId)
        .then(user => {
            return user.removeFromCart(productId)
        })
        .then(result => {
            res.status(201).json({
                message: "Deleted from cart",
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}
