import { api } from './api'

export const getRestaurants = () => api.get('/auth/restaurants')
