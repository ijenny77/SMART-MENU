import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarClient from '../../SideBarClient'
import { useAuth } from '../../../context/AuthContext'
import { useClientOrder } from '../../../context/ClientOrderContext'
import { getPublicMenu } from '../../../services/menuService'
import { placeOrder } from '../../../services/orderService'
import drink1 from '../../../assets/Food/drink1.png'
import styles from './ClientMenuPage.module.css'

const ClientMenuPage = () => {
  const navigate  = useNavigate()
  const { user: authUser } = useAuth()
  const { restaurant, table, cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount } = useClientOrder()

  const fullName  = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]

  const [dbItems,         setDbItems]         = useState([])
  const [loading,         setLoading]         = useState(true)
  const [categories,      setCategories]      = useState(['All'])
  const [activeCategory,  setActiveCategory]  = useState('All')
  const [orderPlaced,     setOrderPlaced]     = useState(false)
  const [placingOrder,    setPlacingOrder]    = useState(false)

  useEffect(() => {
    if (!restaurant?.id) { setLoading(false); return }
    getPublicMenu(restaurant.id)
      .then(data => {
        /* Normalise DB rows into the shape the cart expects */
        const normalised = data.map(item => ({
          id:          item._id,
          name:        item.name,
          ingredients: item.ingredients || '',
          category:    item.category,
          rawPrice:    Number(item.price),
          price:       `Frw ${Number(item.price).toLocaleString()}`,
          image:       (item.image_url && !item.image_url.startsWith('blob:')) ? item.image_url : drink1,
          image_url:   (item.image_url && !item.image_url.startsWith('blob:')) ? item.image_url : null,
        }))
        setDbItems(normalised)
        const cats = ['All', ...new Set(normalised.map(i => i.category).filter(Boolean))]
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [restaurant?.id])

  const displayed = activeCategory === 'All'
    ? dbItems
    : dbItems.filter(item => item.category === activeCategory)

  const cartQty = (id) => cart.find(e => e.item.id === id)?.qty ?? 0

  const handlePlaceOrder = async () => {
    if (cart.length === 0 || placingOrder) return
    setPlacingOrder(true)
    try {
      await placeOrder(restaurant?.id, cart)
    } catch (err) {
      console.error('Order failed:', err.message)
    } finally {
      clearCart()
      setOrderPlaced(true)
      setPlacingOrder(false)
      setTimeout(() => navigate('/ClientDashboard'), 2000)
    }
  }

  if (orderPlaced) {
    return (
      <div className={styles.pageWrapper}>
        <SideBarClient />
        <div className={styles.successScreen}>
          <div className={styles.successCard}>
            <p className={styles.successIcon}>✓</p>
            <h2 className={styles.successTitle}>Order Placed!</h2>
            <p className={styles.successSub}>
              Your order for <strong>{restaurant?.name || 'the restaurant'}</strong>
              {table?.label && `, ${table.label}`} is confirmed.
              <br />Redirecting to your dashboard…
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <SideBarClient />

      <div className={styles.main}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div>
            <p className={styles.welcome}>Welcome back &nbsp;<strong>{firstName}</strong></p>
            <h1 className={styles.heading}>Choose Your Order</h1>
            <p className={styles.subtitle}>
              {restaurant?.name}{table?.label && ` · ${table.label}`}
            </p>
          </div>
        </div>

        <div className={styles.layout}>

          {/* ── Left: menu list ── */}
          <div className={styles.menuSide}>

            {/* Category tabs derived from DB */}
            <div className={styles.tabs}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.tab} ${activeCategory === cat ? styles.tabActive : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading && <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading menu…</p>}

            {!loading && displayed.length === 0 && (
              <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No items in this category.</p>
            )}

            <div className={styles.itemList}>
              {displayed.map(item => {
                const qty = cartQty(item.id)
                return (
                  <div key={item.id} className={styles.itemRow}>
                    <img src={item.image} alt={item.name} className={styles.itemImg} onError={e => { e.target.onerror = null; e.target.src = drink1 }} />
                    <div className={styles.itemBody}>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemIngredients}>{item.ingredients}</p>
                      <p className={styles.itemPrice}>{item.price}</p>
                    </div>
                    <div className={styles.qtyControls}>
                      {qty > 0 && (
                        <>
                          <button className={styles.qtyBtn} onClick={() => removeFromCart(item.id)}>−</button>
                          <span className={styles.qtyNum}>{qty}</span>
                        </>
                      )}
                      <button className={styles.addBtn} onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Right: cart ── */}
          <div className={styles.cartSide}>
            <p className={styles.cartTitle}>
              Your Cart {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </p>

            {cart.length === 0
              ? <p className={styles.cartEmpty}>Add items from the menu</p>
              : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map(({ item, qty }) => (
                      <div key={item.id} className={styles.cartRow}>
                        <img src={item.image} alt={item.name} className={styles.cartImg} />
                        <div className={styles.cartInfo}>
                          <p className={styles.cartItemName}>{item.name}</p>
                          <p className={styles.cartItemPrice}>{item.price} × {qty}</p>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => { for (let i = 0; i < qty; i++) removeFromCart(item.id) }}
                        >✕</button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartFooter}>
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Total</span>
                      <span className={styles.totalVal}>Frw {cartTotal.toLocaleString()}</span>
                    </div>
                    <button
                      className={styles.placeOrderBtn}
                      onClick={handlePlaceOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? 'Placing…' : 'Place Order →'}
                    </button>
                  </div>
                </>
              )
            }
          </div>

        </div>
      </div>
    </div>
  )
}

export default ClientMenuPage
