const mongoose = require('mongoose')

const menuSchema = new mongoose.Schema({
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String
    },
    image_url:{
        type:String
    },
    isAvailable:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

module.exports = mongoose.model('Menu',menuSchema)