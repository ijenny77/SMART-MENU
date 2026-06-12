import { api } from './api'

export const getMenuItems = () => api.get('/menu')

export const getPublicMenu = (restaurantId) => api.get(`/menu/public/${restaurantId}`)

export const addMenuItem = (item) => api.post('/menu', item)

export const updateMenuItem = (id, item) => api.put(`/menu/${id}`, item)

export const deleteMenuItem = (id) => api.delete(`/menu/${id}`)

export const toggleMenuItemAvailability = (id) => api.patch(`/menu/${id}/availability`, {})
