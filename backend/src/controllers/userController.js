const User  = require('../models/User')
const Order = require('../models/Orders')

const getClients = async (req, res) => {
    try {
        const clientIds = await Order.find({ restaurantId: req.user._id }).distinct('clientId')
        const clients = await User.find({ _id: { $in: clientIds }, role: 'client' }).select('-password')
        res.json(clients)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        await user.deleteOne()
        res.json({ message: 'User deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { restaurantName, name } = req.body
        const updates = {}
        if (restaurantName !== undefined) updates.restaurantName = restaurantName
        if (name !== undefined) updates.name = name
        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password')
        res.json({ id: user._id, name: user.name, email: user.email, role: user.role, restaurantName: user.restaurantName })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'currentPassword and newPassword are required' })
        }
        const user = await User.findById(req.user._id)
        const match = await require('bcryptjs').compare(currentPassword, user.password)
        if (!match) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }
        user.password = await require('bcryptjs').hash(newPassword, 10)
        await user.save()
        res.json({ message: 'Password updated successfully' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getClients, deleteUser, updatePassword, updateProfile }
