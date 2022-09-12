const  mongoose= require("mongoose");
const userSchema=mongoose.Schema({
    uname:String,
address:String,
mobile:String,
email:String,
username:String,
userpass:String,
blogs:[
    { type:mongoose.Types.ObjectId,
        ref:"Blog",
        required:true
    }]
});
module.exports=mongoose.model("User",userSchema);