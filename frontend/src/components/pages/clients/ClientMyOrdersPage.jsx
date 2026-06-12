import React, { useState, useEffect } from 'react'
import SideBarClient from '../../SideBarClient'
import { useAuth } from '../../../context/AuthContext'
import { getMyOrders } from '../../../services/orderService'
import drink1 from '../../../assets/Food/drink1.png'
import styles from './ClientMyOrdersPage.module.css'

const FILTERS = ['All', 'pending', 'preparing', 'delivered', 'rejected']

const StatusBadge = ({ status }) => {
  const cls =
    status === 'delivered' ? styles.badgeCompleted  :
    status === 'preparing' ? styles.badgePreparing  :
    status === 'rejected'  ? styles.badgeRejected   :
                             styles.badgePending
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'
  return <span className={`${styles.badge} ${cls}`}>{label}</span>
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ClientMyOrdersPage = () => {
  const { user: authUser } = useAuth()
  const fullName  = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]

  const [orders,       setOrders]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [expanded,     setExpanded]     = useState(null)

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const displayed = activeFilter === 'All'
    ? orders
    : orders.filter(o => o.status === activeFilter)

  return (
    <div className={styles.pageWrapper}>
      <SideBarClient />

      <div className={styles.main}>

        <div className={styles.header}>
          <p className={styles.welcome}>Welcome back &nbsp;<strong>{firstName}</strong></p>
          <h1 className={styles.heading}>My Orders</h1>
          <p className={styles.subtitle}>Track all your past and current orders</p>
        </div>

        <div className={styles.tabs}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.tab} ${activeFilter === f ? styles.tabActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: 'var(--text-muted)' }}>Loading your orders…</p>}
        {error   && <p style={{ color: '#f87171' }}>Error: {error}</p>}

        <div className={styles.orderList}>
          {!loading && !error && displayed.length === 0 && (
            <p className={styles.empty}>No orders found.</p>
          )}

          {displayed.map(order => (
            <div key={order._id} className={styles.orderCard}>
              <div
                className={styles.cardHeader}
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
              >
                <img src={drink1} alt="" className={styles.restImg} />
                <div className={styles.cardInfo}>
                  <p className={styles.restName}>
                    {(order.items || []).map(i => i.name).join(', ') || '—'}
                  </p>
                  <p className={styles.orderMeta}>
                    #{String(order._id).slice(-8)} · {fmtDate(order.createdAt)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <p className={styles.orderTotal}>Frw {Number(order.totalAmount).toLocaleString()}</p>
                <span className={styles.chevron}>{expanded === order._id ? '▲' : '▼'}</span>
              </div>

              {expanded === order._id && (
                <div className={styles.itemsPanel}>
                  {(order.items || []).map((item, i) => (
                    <div key={i} className={styles.itemRow}>
                      <img src={drink1} alt="" className={styles.itemImg} />
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemQty}>× {item.quantity}</p>
                      <p className={styles.itemPrice}>Frw {Number(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default ClientMyOrdersPage
