const router = require('express').Router();
const Product = require('../models/Product');


//Get product by id
router.get('/getById/', async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);
        res.status(200).send({ _id: req.query.id, message: "Get product correctly", product: product });
    } catch (error) {
        res.status(400).send({ _id: req.query.id, catchMessage: error.toString() });
    }
});

//Get product by filters
router.get('/getByFilters/', async (req, res) => {
    try {

        //Default values
        let limit = 100;
        let offset = 0;
        let order = "asc"

        //Create the filters' object
        let filters = {};
        if (req.query.name && req.query.name !== "") filters = { ...filters, name: { $regex: new RegExp(req.query.name, "i") } }
        if (req.query.description && req.query.description !== "") filters = { ...filters, description: { $regex: new RegExp(req.query.description, "i") } }
        if (req.query.category && req.query.category !== "") filters = { ...filters, category: req.query.category }
        if (req.query.code && req.query.code !== "") filters = { ...filters, code: { $regex: req.query.code } }
        if (req.query.priceMin && req.query.priceMin !== "") filters = { ...filters, price: { $gte: req.query.priceMin } }
        if (req.query.priceMax && req.query.priceMax !== "") filters = { ...filters, price: { $lt: req.query.priceMax } }
        if (req.query.limit) limit = parseInt(req.query.limit);
        if (req.query.offset) offset = parseInt(req.query.offset);

        //Create the sort's object
        let sort = {}
        if (req.query.sortField) {
            if (req.query.sortOrder) order = req.query.sortOrder;
            if (req.query.sortField) sort[req.query.sortField] = order;
        }

        //Find the products
        const products = await Product.find(filters).sort(sort).skip(offset).limit(limit);

        //Response
        res.status(200).send({ message: "Get products filtered correctly", products: products });

    } catch (error) {
        res.status(400).send({ catchMessage: error.toString() });
    }
});

//Add product
router.post('/add/', async (req, res) => {

    //Create the product
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        code: req.body.code,
        price: req.body.price,
        brand: req.body.brand
    })

    //Save de product
    try {
        const productSaved = await product.save();
        res.status(200).send({ message: "Product created correctly", product: productSaved._id });
    } catch (error) {
        res.status(400).send({ catchMessage: error.toString() });
    }
});

//Add list of products
router.post('/addList/', async (req, res) => {

    try {
        //Variables
        let productsWithError = [];

        //Foreach product
        for (let index = 0; index < req.body.products.length; index++) {

            //Product
            const element = req.body.products[index];

            //Create the product
            const product = new Product({
                name: element.name,
                description: element.description,
                category: element.category,
                code: element.code,
                price: element.price,
                brand: element.brand
            })

            //Save de product
            try {
                await product.save();
            } catch (error) {
                productsWithError.push({ messageError: error.toString(), product: product });
            }

        }

        res.status(200).send({ message: "Products created correctly", listErrors: productsWithError });
        
    } catch (error) {
        res.status(400).send({ errorMessage: error.toString() });
    }

});

//Delete product
router.delete('/delete/', async (req, res) => {
    //Save de product
    try {
        const product = await Product.deleteOne({ _id: req.query.id });
        res.status(200).send({ product: product, message: "Product deleted correctly", product: product._id });
    } catch (error) {
        res.status(400).send({ catchMessage: error.toString() });
    }
});

//Update product
router.put('/update/', async (req, res) => {
    try {
        const product = await Product.updateOne({ _id: req.query.id }, req.body);
        res.status(200).send({ product: product, message: "Product updated correctly", product: product._id });
    } catch (error) {
        res.status(400).send({ catchMessage: error.toString() });
    }
});


module.exports = router;