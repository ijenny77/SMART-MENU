import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarClient from '../../SideBarClient'
import { useAuth } from '../../../context/AuthContext'
import { getMyOrders } from '../../../services/orderService'
import { getRestaurants } from '../../../services/restaurantService'
import menuIcon from '../../../assets/restaurant/menu.png'
import bagIcon  from '../../../assets/restaurant/bag.png'
import r1 from '../../../assets/restaurant/A fine dining experience in a Michelin-starred… 2.png'
import r2 from '../../../assets/restaurant/Elegant Fine Dining_ A beautifully set dining… 1.png'
import r3 from '../../../assets/restaurant/Interior Design - Ho Lee Fook 2022 - Central SOHO, Hong Kong by dix design+architecture — Design Anthology 2.png'
import r4 from '../../../assets/restaurant/RIWAQDESIGNS  Warm wood tones, ambient lighting… 2.png'
import drink1 from '../../../assets/Food/drink1.png'
import styles from './ClientDashboard.module.css'

const FALLBACK_IMAGES = [r1, r2, r3, r4]

const statusCls = (status, styles) =>
  status === 'pending'   ? styles.statusPreparing :
  status === 'preparing' ? styles.statusPreparing :
  status === 'delivered' ? styles.statusCompleted :
                           styles.statusCompleted

const ClientDashboard = () => {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const fullName  = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]

  const [allMyOrders,     setAllMyOrders]     = useState([])
  const [topRests,        setTopRests]        = useState([])
  const [restaurantCount, setRestaurantCount] = useState(0)
  const [loading,         setLoading]         = useState(true)

  useEffect(() => {
    const load = async () => {
      const [orders, restaurants] = await Promise.all([
        getMyOrders().catch(() => []),
        getRestaurants().catch(() => []),
      ])
      setAllMyOrders(orders)
      setRestaurantCount(restaurants.length)
      setTopRests(restaurants.slice(0, 4))
      setLoading(false)
    }
    load()
  }, [])

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayMyOrders = allMyOrders.filter(o => new Date(o.createdAt) >= todayStart)
  const myTotalSpent  = allMyOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)
  const recentOrders  = allMyOrders.slice(0, 3)

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <SideBarClient />
        <div className={styles.main}><p style={{ color: 'var(--text-muted)' }}>Loading…</p></div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <SideBarClient />

      <div className={styles.main}>

        <div className={styles.header}>
          <p className={styles.welcome}>Welcome back &nbsp;<strong>{firstName}</strong></p>
          <h1 className={styles.heading}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Here's what's happening with your orders.</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Restaurants</p>
            <p className={styles.statValue}>{restaurantCount}</p>
            <p className={styles.statSub}>Available locations</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>My Total Orders</p>
            <p className={styles.statValue}>{allMyOrders.length}</p>
            <p className={styles.statSub}>All-time orders</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>My Orders Today</p>
            <p className={styles.statValue}>{todayMyOrders.length}</p>
            <p className={styles.statSub}>Orders placed today</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Spent</p>
            <p className={`${styles.statValue} ${styles.statHighlight}`}>
              Frw {myTotalSpent.toLocaleString()}
            </p>
            <p className={`${styles.statSub} ${styles.statSubGreen}`}>All-time spending</p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Recent Orders</p>
            <button className={styles.viewAll} onClick={() => navigate('/clientOrders')}>View all</button>
          </div>

          <div className={styles.orderList}>
            {recentOrders.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No orders yet.</p>
              : recentOrders.map((o) => (
                <div key={o._id} className={styles.orderRow}>
                  <img src={drink1} alt="" className={styles.orderImg} />
                  <div className={styles.orderInfo}>
                    <p className={styles.orderName}>{(o.items || []).map(i => i.name).join(', ') || '—'}</p>
                    <p className={styles.orderMeta}>Order #{String(o._id).slice(-6)}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${statusCls(o.status, styles)}`}>
                    {o.status ? o.status.charAt(0).toUpperCase() + o.status.slice(1) : '—'}
                  </span>
                  <p className={styles.orderPrice}>Frw {Number(o.totalAmount).toLocaleString()}</p>
                </div>
              ))
            }
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTitle}>Top Restaurants</p>
          </div>

          {topRests.length === 0
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No restaurants yet.</p>
            : (
              <div className={styles.topGrid}>
                {topRests.map((r, idx) => (
                  <div key={r._id} className={styles.topCard}>
                    <img
                      src={FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                      alt={r.name}
                      className={styles.topImg}
                    />
                    <div className={styles.topBody}>
                      <p className={styles.topName}>{r.name}</p>
                      <p className={styles.topDesc}>{r.email}</p>
                      <div className={styles.topStats}>
                        <div className={styles.topStatItem}>
                          <img src={bagIcon} alt="" className={styles.topStatIcon} />
                          <div>
                            <span className={styles.topStatVal}>{allMyOrders.length}</span>
                            <span className={styles.topStatLabel}>My Orders</span>
                          </div>
                        </div>
                        <div className={styles.topStatItem}>
                          <img src={menuIcon} alt="" className={styles.topStatIcon} />
                          <div>
                            <span className={styles.topStatVal}>—</span>
                            <span className={styles.topStatLabel}>Menu Items</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

      </div>
    </div>
  )
}

export default ClientDashboard
