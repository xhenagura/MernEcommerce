const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbid");
const { generateRefreshToken } = require("../config/refreshToken");


const createUser = asyncHandler(async(req, res) => {
    const email = req.body.email;

    const findUser = await User.findOne({email: email});

    if(!findUser){
        // Create a new user

        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        // User already exists
        throw new Error("User Already Exists");
    }
});


const loginUserCtrl = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    // console.log(email, password)

    const findUser = await User.findOne({ email});
    if(findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, 
        {new:true});
        res.cookie('refreshToken', refreshToken,
        {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })
        res.json({
            _id:findUser?._id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            email:findUser?.email,
            mobile:findUser?.mobile,
            token:generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials")
    }
});


// Update a user 

const updatedUser = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try{

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            },
            {
                new:true
            }
        );
        res.json(updatedUser);
    }catch(error){
        throw new Error(error);
    }
})
// Get all users

const getallUsers = asyncHandler( async(req, res) => {
    try{

        const getUsers = await User.find();
        res.json(getUsers)
    }catch(error) {
        throw new Error(error);
    }
});


// Get a single user 

const getaUser = asyncHandler(async(req, res) => {
    // console.log(req.params)
    const {id} = req.params;
    validateMongoDbId(id);
    try{

        const getaUser = await User.findById(id);
        res.json({getaUser})
    }catch(error){
        throw new Error(error);
    }
})

// Delete a user
const deleteaUser = asyncHandler(async(req, res) => {
    // console.log(req.params)
    const {id} = req.params;
    validateMongoDbId(id);
    try{

        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({deleteaUser})
    }catch(error){
        throw new Error(error);
    }
})

const blockUser = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);

    try{
        const block = await User.findByIdAndUpdate(id, {
            isBlocked:true,
        },
        {
            new:true
        }
    );
    res.json({
        message:"User Blocked"
    })
    }catch(error){
        throw new Error(error);
    }
})
const unblockUser = asyncHandler( async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);

    try{
        const unblock = await User.findByIdAndUpdate(id, {

            isBlocked:false,
        },
        {
            new:true
        }
    );
    res.json({
        message:"User UnBlocked"
    })
    }catch(error){
        throw new Error(error);
    }
})
module.exports={createUser, loginUserCtrl, getallUsers, getaUser, deleteaUser, updatedUser,blockUser, unblockUser};