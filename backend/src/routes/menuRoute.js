const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getMenus,createMenu,updateMenu,deleteMenu,getPublicMenu,toggleAvailability,getMenuById } = require('../controllers/menuController')
const { adminOnly } = require('../middleware/adminMiddleware')

router.get('/public/:restaurantId',getPublicMenu)
router.get('/',protect,getMenus)
router.get('/:id',protect,getMenuById)
router.post('/',protect,adminOnly,createMenu)
router.put('/:id',protect,adminOnly,updateMenu)
router.delete('/:id',protect,adminOnly,deleteMenu)
router.patch('/:id/availability',protect,adminOnly,toggleAvailability)

module.exports = router