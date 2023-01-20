const User = require("../models/userModel");

const createUser = async(req, res) => {
    const email = req.body.email;

    const findUser = await User.findOne({email: email});

    if(!findUser){
        // Create a new user

        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        // User already exists

        res.json
            ({
                msg:"User Already Exists",
                success:false
            });
    }
};

module.exports={createUser}