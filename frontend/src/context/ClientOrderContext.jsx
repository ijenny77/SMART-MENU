import React, { createContext, useContext, useState } from 'react'

const ClientOrderContext = createContext(null)

export const ClientOrderProvider = ({ children }) => {
  const [restaurant, setRestaurant] = useState(null)  // { id, name, image, description }
  const [table,      setTable]      = useState(null)  // { id, label }
  const [cart,       setCart]       = useState([])    // [{ item, qty }]

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(e => e.item.id === item.id)
      if (existing) return prev.map(e => e.item.id === item.id ? { ...e, qty: e.qty + 1 } : e)
      return [...prev, { item, qty: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existing = prev.find(e => e.item.id === itemId)
      if (!existing) return prev
      if (existing.qty === 1) return prev.filter(e => e.item.id !== itemId)
      return prev.map(e => e.item.id === itemId ? { ...e, qty: e.qty - 1 } : e)
    })
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, e) => sum + e.qty * e.item.rawPrice, 0)
  const cartCount = cart.reduce((sum, e) => sum + e.qty, 0)

  return (
    <ClientOrderContext.Provider value={{
      restaurant, setRestaurant,
      table,      setTable,
      cart,       addToCart, removeFromCart, clearCart,
      cartTotal,  cartCount,
    }}>
      {children}
    </ClientOrderContext.Provider>
  )
}

export const useClientOrder = () => useContext(ClientOrderContext)
