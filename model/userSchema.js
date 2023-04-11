const mongoose=require("mongoose")

const userShema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    email:{
        type:String,
        required:true,
        min:6,
        max:255
    },
    password:{
        type:String,
        required:true,
        min:4,
        max:10
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('userDetails',userShema)