const Menu  = require('../models/Menu')

const getMenus = async(req,res) => {
    try{
        let menus
        if(req.user.role === 'admin'){
            menus = await Menu.find({restaurantId:req.user._id})
        }else{
            menus = await Menu.find({isAvailable:true})
        }
        res.json(menus)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const getPublicMenu = async(req,res) => {
    try{
        const menus = await Menu.find({restaurantId:req.params.restaurantId,isAvailable:true})
        res.json(menus)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const createMenu = async (req,res) => {
    try{
        const {name,description,price,category,image_url} = req.body
        if(!name || !price){
            return res.status(400).json({message:'Name and price are required'})
        }
        const menu = await Menu.create({
            restaurantId:req.user._id,
            name,
            description,
            price,
            category,
            image_url
        })
        res.status(201).json(menu)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const updateMenu = async(req,res) =>{
    try{
        const menu = await Menu.findById(req.params.id)
        if(!menu) {
            return res.status(404).json({message:'Menu item not found'})
        }
        if(menu.restaurantId.toString() !== req.user._id.toString()){
            return res.status(403).json({message:'Not authorized'})
        }
        const {name,description,price,category,image_url} = req.body
        const updated = await Menu.findByIdAndUpdate(
            req.params.id,
            {name,description,price,category,image_url},
            {new:true}
        )
        res.json(updated)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const deleteMenu = async(req,res) =>{
    try{
        const menu = await Menu.findById(req.params.id)
        if(!menu){
            return res.status(404).json({message:'Menu item not found'})
        }
        if(menu.restaurantId.toString() !== req.user._id.toString()){
            return res.status(403).json({message:'Not authorized'})
        }
        await menu.deleteOne()
        res.json({message:'Menu item deleted'})
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const toggleAvailability = async(req,res) => {
    try{
        const menu = await Menu.findById(req.params.id)
        if(!menu){
            return res.status(404).json({message:"Menu item not found"})
        }
        if(menu.restaurantId.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"Not authorized"})
        }
        menu.isAvailable = !menu.isAvailable
        await menu.save()
        res.json(menu)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
const getMenuById = async(req,res) => {
    try{
        const menu = await Menu.findById(req.params.id)
        if(!menu){
            return res.status(404).json({message:'Menu item not found'})
        }
        res.json(menu)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
module.exports = {getMenus,createMenu,updateMenu,deleteMenu,getPublicMenu,toggleAvailability,getMenuById}