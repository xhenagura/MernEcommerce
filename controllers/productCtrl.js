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

        const findProduct = await Product.findById(id);
        res.json(findProduct);
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