const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async(req, res) => {
    try{

        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)

    }catch(error){
        throw new Error(error);
    }
    
});

const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    console.log(req.body.title)
    try{
        if(req.body.title){
            req.body.slug= slugify(req.body.title);
        }

        const updateProduct = await Product.findOneAndUpdate(id, req.body, {
            new: true,
        });
        console.log(updateProduct)
        res.json(updateProduct);

    }catch(error){
        throw new Error(error);
    }
})


const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    console.log(id)
    try{
        if(req.body.title){
            req.body.slug= slugify(req.body.title);
        }

        const deleteProduct = await Product.findOneAndDelete(id);
        console.log(deleteProduct)
        res.json(deleteProduct);

    }catch(error){
        throw new Error(error);
    }
})

const getProduct = asyncHandler(async(req, res) => {
    console.log(req.query)
     const {id} = req.params;
     try{
        // Filtering
        const queryObj = { ...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query =  Product.find(JSON.stringify(queryStr));

        // Sorting
        if(req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ");
            query = query.sort(sortBy)
        }else{
            query = query.sort("-createdAt");
        }

        // Limiting the fields 
        
        if(req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select('__v');
        }

        //Pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page -1) * limit;
        console.log(page, limit, skip);
        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This Page does not exists");
        }

        console.log(page, limit, skip);
        const product = await query;
        res.json(product);
     }catch(error){
        throw new Error(error);
     }
});


const getAllProduct = asyncHandler(async(req, res) => {
    try{

        const getProducts = await Product.find();
        res.json(getProducts);
    }catch(error){
        throw new Error(error); 
    }
});

module.exports = { createProduct, getProduct, getAllProduct, updateProduct, deleteProduct};