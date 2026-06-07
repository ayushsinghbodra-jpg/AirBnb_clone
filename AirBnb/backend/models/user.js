const mongoose = require('mongoose');
const userSchema=mongoose.schema({
    firstName : {
        type : String,
        required:[true,'First name is required'],
    },
    lastName : String,
    email : {
        tupe : String,
        unique : true,
        required : [true,'Email is required'],
    },
    password : {
        type : String,
        required : [true,'Password is required'],   
    },
    userType : {
        type : String,
        enum : ['guest','host'],
        default : 'guest',
    },
    favourites : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Home',
    }]
});
module.exports=mongoose.model('User',userSchema);