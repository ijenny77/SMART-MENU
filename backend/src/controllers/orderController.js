const Order = require('../models/Orders')

const createOrder = async(req,res) => {
    try{
        const {restaurantId,items} = req.body
        if(!restaurantId || !items || !items.length){
            return res.status(400).json({message:'restaurantId,items are required'})
        }
        const totalAmount = items.reduce((sum,item)=>sum + (item.price * item.quantity),0)
        const order = await Order.create({
            restaurantId,
            clientId:req.user._id,
            items,
            totalAmount
        })
        res.status(201).json(order)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const getOrders = async (req,res) => {
    try{
        let orders 
        if(req.user.role  == 'admin'){
            orders = await Order.find({restaurantId:req.user._id})
        }else{
            orders = await Order.find({clientId:req.user._id})
        }
        res.status(200).json(orders)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const updateOrderStatus = async (req,res) => {
    try{
        const {status} = req.body
        const allowedStatuses = ['pending','preparing','rejected','delivered']

        if(!status || !allowedStatuses.includes(status)){
            return res.status(400).json({message:`Status must be one of:${allowedStatuses.join(', ')}`})
        }
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(404).json({message:'Order not found'})
        }
        if(order.restaurantId.toString() !== req.user._id.toString()){
            return res.status(403).json({message:'Not authorized to update this order'})
        }
        order.status = status
        await order.save()
        res.status(200).json(order)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const getOrderById = async(req, res) => {
    try{
        const order = await Order.findById(req.params.id)
        if(!order){
            return res.status(404).json({ message:'Order not found' })
        }
        if(order.clientId.toString() !== req.user._id.toString() && order.restaurantId.toString() !== req.user._id.toString()){
            return res.status(403).json({ message:'Not authorized' })
        }
        res.json(order)
    }catch(err){
        res.status(500).json({ message:err.message })
    }
}

module.exports = {createOrder,getOrders,updateOrderStatus,getOrderById}