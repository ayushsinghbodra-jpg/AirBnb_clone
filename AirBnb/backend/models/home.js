const mongoose = require('mongoose');
const homeSchema=mongoose.Schema({
    houseName : {
        type : String,
        required : true,
    },
    location : {
        type :String,
        required : true,
    },
    rating :{
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    photo : {
        url : String,
        public_id : String
    },
    description : String,
});
module.exports=mongoose.model('Home', homeSchema);