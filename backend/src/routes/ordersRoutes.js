const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {getOrders,createOrder,updateOrderStatus,getOrderById} = require('../controllers/orderController')
const { adminOnly } = require('../middleware/adminMiddleware')

router.get('/',protect,getOrders)
router.get('/:id',protect,getOrderById)
router.post('/',protect,createOrder)
router.put('/:id/status',protect,adminOnly,updateOrderStatus)
module.exports = router