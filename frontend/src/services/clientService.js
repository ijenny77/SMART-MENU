import { api } from './api'

export const getClients = () => api.get('/users/clients')

export const deleteClient = (id) => api.delete(`/users/${id}`)

export const addClient = () => Promise.reject(new Error('Clients register themselves via the sign-up page.'))
