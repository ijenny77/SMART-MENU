const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { adminOnly } = require('../middleware/adminMiddleware')
const { getClients, deleteUser, updatePassword, updateProfile } = require('../controllers/userController')

router.get('/clients', protect, adminOnly, getClients)
router.delete('/:id', protect, adminOnly, deleteUser)
router.put('/password', protect, updatePassword)
router.patch('/profile', protect, updateProfile)

module.exports = router
