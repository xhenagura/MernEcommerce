const { default: mongoose } = require("mongoose")

const dbConnect = () => {
    try{
        mongoose.set("strictQuery", false);
        const conn = mongoose.connect(process.env.MONGODB_URL)
        console.log("Database successfully conected")
    }catch(error){
        console.log("Database error");
    }
};

module.exports=dbConnect