const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const Categories = require('../models/categories');
const Product = require('../models/products');
const AppbarCategories = require('../models/appbarCategories');
const FeaturedProduct = require('../models/featuredProducts');
const BannerPictures = require('../models/bannerPictures');
const Order = require('../models/order');

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
    const title = req.body.title;
    const category = req.body.category;
    const subCategory = req.body.subCategory;
    const brand = req.body.brand;
    const bulletPoints = req.body.bulletPoints;
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
    let imageUrlsFromFirebase = [];

    if (req.files.length === 0) {
        const error = new Error("No images uploaded");
        error.statusCode = 403;
        throw error;
    }

    imageUrls.forEach(image => {
        const form = new FormData();
        form.append('image', fs.createReadStream(image));
        const formHeaders = form.getHeaders();
        axios({
            url: `https://us-central1-computer-store-264522.cloudfunctions.net/uploadFile`,
            method: "POST",
            data: form,
            headers: {
                ...formHeaders,
            },
        }).then(response => {
            imageUrlsFromFirebase.push(response.data.imageUrl);
        }).then(() => {
            if (imageUrlsFromFirebase.length === imageUrls.length) {
                const product = new Product({
                    title,
                    category,
                    subCategory,
                    brand,
                    bulletPoints,
                    price,
                    pictures: imageUrlsFromFirebase,
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
                        imageUrls.forEach(image => {
                            fs.unlink(image, (err) => {
                                if (err) {
                                    console.error(err)
                                    return
                                }
                            })

                            //file removed
                        })
                        console.log('Product saved in database.');
                        res.status(201).json({
                            message: 'Product saved in database',
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'Internal Server Error',
                        });
                    })
            }
        }).catch(err => {
            res.status(200).json({
                message: 'Error Occoured. No images provided',
            })
        })
    })
}

exports.addAppbarCategories = (req, res, next) => {
    const name = req.body.cateogryName;

    const appbarCategories = new AppbarCategories({
        name,
    })

    Categories
        .findOne({ name: name })
        .then(category => {
            if (!category) {
                const error = new Error('This is not a category');
                error.statusCode = 400;
                throw error;
            }

            return AppbarCategories.findOne({ name: name })
        })
        .then(result => {
            if (result) {
                const error = new Error('Category already exists');
                error.statusCode = 403;
                throw error;
            }
            return appbarCategories.save()
        })
        .then(result => {
            res.status(201).json({
                message: "Category added to appbar"
            });
        })
        .catch(err => {
            console.log(err);
            if (err.statusCode === 400) {
                res.status(400).json({
                    message: "This is not a category",
                });
            } else if (err.statusCode === 403) {
                res.status(403).json({
                    message: "Category already exists",
                });
            } else {
                res.status(500).json({
                    message: "Internal Server Error",
                });
            }
        });
}

exports.addFeaturedProduct = (req, res, next) => {
    const productId = req.body.productId;

    FeaturedProduct
        .find({ productId: productId })
        .then(product => {
            console.log(product);
            if (product.length > 0) {
                const error = new Error("Already featured");
                error.statusCode = 401;
                throw error;
            }
            return Product
                .findById(productId)
        })
        .then(product => {
            if (!product) {
                const error = new Error("Product does not exist");
                error.statusCode = 421;
                throw err;
            }

            const featuredProduct = new FeaturedProduct({
                productId: productId,
            })

            return featuredProduct.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Added to featured products',
            });
        })
        .catch(err => {
            if (err.statusCode === 401) {
                res.status(500).json({
                    message: 'Product Already Featured',
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                });
            }
        });
}

exports.removeFromFeatured = (req, res, next) => {
    const prodId = req.body.prodId;
    console.log(prodId)

    FeaturedProduct
        .findByIdAndDelete(prodId)
        .then(result => {
            res.status(200).json({
                message: 'Deleted from featured products',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.ChangeStock = (req, res, next) => {
    const prodId = req.body.prodId;
    const newStock = req.body.newStock;

    Product
        .findById(prodId)
        .then(product => {
            if (!product) {

            }
            product.stock = newStock;
            return product.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Stock Updated",
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Interal Server Error',
            });
        });
}

exports.changeBanners = (req, res, next) => {
    let imageUrls = [];
    req.files.forEach(file => {
        imageUrls.push(file.path.replace("\\", "/"));
    })
    let imageUrlsFromFirebase = [];

    if (req.files.length === 0) {
        const error = new Error("No images uploaded");
        error.statusCode = 403;
        throw error;
    }

    imageUrls.forEach(image => {
        const form = new FormData();
        form.append('image', fs.createReadStream(image));
        const formHeaders = form.getHeaders();
        axios({
            url: `https://us-central1-computer-store-264522.cloudfunctions.net/uploadFile`,
            method: "POST",
            data: form,
            headers: {
                ...formHeaders,
            },
        }).then(response => {
            imageUrlsFromFirebase.push(response.data.imageUrl);
        }).then(() => {
            if (imageUrlsFromFirebase.length === imageUrls.length) {

                imageUrlsFromFirebase.forEach(image => {
                    const bannerPictures = new BannerPictures({
                        src: image,
                    });

                    bannerPictures.save();
                })

                imageUrls.forEach(image => {
                    fs.unlink(image, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })

                    //file removed
                })
                res.status(201).json({
                    message: 'Images Uploded'
                })
            }
        }).catch(err => {
            console.log(err);
            res.status(200).json({
                message: 'Error Occoured. No images provided',
            })
        })
    })
}

exports.getPendingOrders = (req, res, next) => {

    Order
        .find({ delievery: 'Pending' })
        .then(orders => {
            res.status(200).json({
                orders: orders,
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.getCompletedOrders = (req, res, next) => {

    Order
        .find({ delievery: 'Delievered' })
        .then(orders => {
            res.status(200).json({
                orders: orders,
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.getOrder = (req, res, next) => {
    const orderId = req.params.orderId;

    Order
        .findById(orderId)
        .then(order => {
            if (!order) {

            }
            res.status(200).json({
                order
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.markAsDelievered = (req, res, next) => {
    const orderId = req.body.orderId;

    Order
        .findById(orderId)
        .then(order => {
            if (!order) {

            }
            order.delievery = "Delievered";
            order.status = "Order Completed";
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Marked as Delievered. Order Completed',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).sjon({
                message: 'Internal Server Error',
            });
        });
}

exports.deleteBanner = (req, res, next) => {
    const bannerId = req.body.bannerId;

    BannerPictures
        .findByIdAndDelete(bannerId)
        .then(result => {
            res.status(201).json({
                message: "Banner Deleted",
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}
