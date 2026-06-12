import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user,    setUser]    = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) { setLoading(false); return }
        api.get('/auth/me')
            .then(data => setUser(data))
            .catch(() => localStorage.removeItem('token'))
            .finally(() => setLoading(false))
    }, [])

    const signIn = async ({ email, password }) => {
        const data = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', data.token)
        setUser(data.user)
        return data
    }

    const signUp = async ({ email, password, options }) => {
        const { full_name: name, role, restaurantName } = options?.data || {}
        const data = await api.post('/auth/register', { name, email, password, role, restaurantName })
        localStorage.setItem('token', data.token)
        if (data.user?.role === 'admin') localStorage.setItem('justRegistered', 'true')
        setUser(data.user)
        return data
    }

    const signOut = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
