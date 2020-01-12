const stripePrivateKey = require('../utilities/stripePrivateKey');
const stripe = require("stripe")(stripePrivateKey.privateKey);

const { validationResult } = require('express-validator');
const User = require('../models/user');
const Products = require('../models/products');
const Order = require('../models/order');
const FeaturedProduct = require('../models/featuredProducts');
const BannerPictures = require('../models/bannerPictures');


exports.getProductByCategory = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 10;
    let totalItems;
    console.log(currentPage);

    const categoryName = req.params.categoryName;
    const order = req.params.order;
    let sort = 'price'
    if (order === '10') {
        sort = 'price'
    } else {
        sort = '-price'
    }

    Products
        .find({ category: categoryName })
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Products
                .find({ category: categoryName })
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
                .sort(sort)
                .then(products => {
                    res.status(200).json({
                        products: products,
                        totalItems: totalItems
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

exports.getProductByCategoryNoPagination = (req, res, next) => {
    const categoryName = req.params.categoryName;

    Products
        .find({ category: categoryName })
        .sort("price")
        .then(products => {
            res.status(200).json({
                products: products,
            });
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

exports.getOutOfStockProducts = (req, res, next) => {
    const categoryName = req.params.categoryName;

    Products
        .find({ category: categoryName, stock: 0 })
        .then(products => {
            res.status(200).json({
                products: products,
            });
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

exports.postDeleteFromCart = (req, res, next) => {
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

exports.postOrder = (req, res, next) => {


    User
        .findById(req.userId)
        .then(user => {
            return user
                .populate('cart.items.productId')
                .execPopulate()
                .then(user => {
                    const products = user.cart.items.map(i => {
                        return { quantity: i.quantity, product: { ...i.productId._doc } };
                    });
                    const order = new Order({
                        user: {
                            userId: user._id,
                            fullName: user.name,
                            addressLine1: user.addressLine1,
                            addressLine2: user.addressLine2,
                            city: user.city,
                            state: user.state,
                            zip: user.zip,
                            country: 'Pakistan',
                            phoneNumber: user.phoneNumber,
                            delieveryInformation: user.delieveryInformation,
                        },
                        products: products,
                    });
                    return order.save();
                })
                .then(result => {
                    return user.clearCart();
                })
                .then(result => {
                    res.status(201).json({
                        message: 'Order Saved',
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Internal Server Error',
                    });
                })
        });
}

exports.charge = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation Failed");
        console.log(errors);
        // const error = new Error()
        const errorArray = [];
        errors.errors.forEach(error => {
            if (error.msg !== "Invalid value")
                errorArray.push(error.msg)
        })
        res.status(422).json({
            message: errorArray,
        })
    }

    const name = req.body.name;
    const cardNumber = req.body.cardNumber;
    const month = req.body.month;
    const year = req.body.year;
    const cvv = req.body.cvv;
    const addressLine1 = req.body.addressLine1;
    const addressLine2 = req.body.addressLine2;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    let shippingCost = 0;
    let price = 0;
    let quantity = 0;
    console.log(req.body)

    stripe.tokens.create(
        {
            card: {
                number: cardNumber,
                exp_month: month,
                exp_year: year,
                cvc: cvv,
                name: name,
                address_line1: addressLine1,
                address_line2: addressLine2,
                address_city: city,
                address_state: state,
                address_zip: zip,
                address_country: 'Pakistan'
            },
        },
        function (err, token) {
            if (err) {
                console.log(err);
                res.status(422).json({
                    message: err.raw.message,
                })
                return false;
            }
            console.log(token.id);
            User
                .findById(req.userId)
                .then(user => {
                    return user
                        .populate('cart.items.productId')
                        .execPopulate()
                        .then(user => {
                            const products = user.cart.items.map(i => {
                                if (city === "Karachi") {
                                    shippingCost = shippingCost + i.productId.shippingInKarachi
                                } else {
                                    shippingCost = shippingCost + i.productId.shippingCost
                                }
                                quantity = i.quantity;
                                price = price + (i.productId.price * quantity);
                                return { quantity: i.quantity, product: { ...i.productId._doc } };
                            });
                            const order = new Order({
                                user: {
                                    userId: user._id,
                                    fullName: user.name,
                                    addressLine1: user.addressLine1,
                                    addressLine2: user.addressLine2,
                                    city: user.city,
                                    state: user.state,
                                    zip: user.zip,
                                    country: 'Pakistan',
                                    phoneNumber: user.phoneNumber,
                                    delieveryInformation: user.delieveryInformation,
                                },
                                products: products,
                                shippingCost: shippingCost,
                                totalPrice: price + shippingCost,
                                delievery: "Pending",
                                status: "Delievery Pending"
                            });
                            return order.save();
                        })
                        .then(result => {
                            stripe.charges.create(
                                {
                                    amount: (price + shippingCost) * 100,
                                    currency: 'pkr',
                                    source: token.id,
                                    description: 'Product(s) Purchased from Computer Store',
                                    metadata: {
                                        order_id: result._id.toString(),
                                    }
                                },
                                function (err, charge) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    if (charge) {
                                        Order.findById(result._id).then(order => { order.receipt = charge.receipt_url; order.save(); })
                                        user
                                            .clearCart()
                                            .then(() => {
                                                res.status(201).json({
                                                    message: 'Order Placed',
                                                    id: result._id.toString(),
                                                });
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                if (error.stausCode === 422) {
                                                    res.status(422).json({
                                                        message: err
                                                    })
                                                }
                                                res.status(500).json({
                                                    message: 'Internal Server Error',
                                                });
                                            })
                                    }
                                }
                            );
                        })
                        .catch(err => {
                            console.log(err);
                            if (err.stausCode === 422) {
                                res.status(422).json({
                                    message: err
                                })
                            }
                            res.status(500).json({
                                message: 'Internal Server Error',
                            });
                        })

                });
        });
}

exports.getOrderRecipt = (req, res, next) => {
    const orderId = req.params.orderId;
    console.log(orderId);

    Order
        .findById(orderId)
        .then(order => {
            if (!order) {

            }
            console.log(order);
            res.status(200).json({
                message: order.receipt,
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getFeaturedProducts = (req, res, nxet) => {
    let productArray = [];

    FeaturedProduct
        .find()
        .then(products => {
            products.forEach((productId, index) => {
                productId
                    .populate('productId')
                    .execPopulate()
                    .then(product => {

                        productArray.push(product);
                        if (products.length === productArray.length) {
                            res.status(200).json({
                                products: productArray
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            message: 'Internal Server Error',
                        });
                    })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.getBanners = (req, res, next) => {

    BannerPictures
        .find()
        .then(banners => {
            res.status(200).json({
                banners: banners,
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Internal Server Error",
            });
        });
}
