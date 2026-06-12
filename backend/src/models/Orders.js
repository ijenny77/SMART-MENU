const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',
        required:true
    },
    clientId:{
        type:mongoose.Schema.Types.ObjectId,ref:'User'
    },
    items:[{
        menuItemId:{ type:mongoose.Schema.Types.ObjectId, ref:'Menu', required:true },
        name:{ type:String, required:true },
        price:{ type:Number, required:true },
        quantity:{ type:Number, default:1 }
    }],
    totalAmount:{
        type:Number,required:true
    },
    status:{
        type:String,
        enum:['pending','preparing','rejected','delivered'],
        default:'pending'
    }
},{timestamps:true})
module.exports = mongoose.model('Order',orderSchema)