import { api } from './api'

export const getOrders = () => api.get('/orders')

export const getMyOrders = () => api.get('/orders')

export const placeOrder = (restaurantId, cartItems) => {
    const items = cartItems.map(({ item, qty }) => ({
        menuItemId: item.id || item._id,
        name:       item.name,
        price:      item.rawPrice ?? item.price,
        quantity:   qty,
    }))
    return api.post('/orders', { restaurantId, items })
}

export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })
