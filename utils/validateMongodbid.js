const moongose = require('mongoose')
const validateMongoDbId = (id) =>{
    const isValid = moongose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("This id is not valid or not Found");
};
module.exports = validateMongoDbId;