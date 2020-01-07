exports.getCategories = (req, res, next) => {
    
    res.status(200).json({
        categories: 'Processors',
    })
}