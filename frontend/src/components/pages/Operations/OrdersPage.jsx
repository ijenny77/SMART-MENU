import React, { useState, useEffect, useMemo } from 'react'
import SideBar from '../../SideBar'
import search      from '../../../assets/Search1.png'
import searchLight from '../../../assets/searchLight.png'
import bell        from '../../../assets/Group 391.png'
import notifLight  from '../../../assets/notificationLight.png'
import user        from '../../../assets/userLight.png'
import userDark    from '../../../assets/User.png'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import drink1 from '../../../assets/Food/drink1.png'
import delivered from '../../../assets/delivered.png'
import waiting from '../../../assets/waiting.png'
import rejected from '../../../assets/rejected.png'
import allOrders from '../../../assets/allOrders.png'
import fire from '../../../assets/fire.png'
import styles from './OrdersPage.module.css'
import { getOrders, updateOrderStatus } from '../../../services/orderService'
import UserMenu from '../../UserMenu'

const filters = ['pending', 'preparing', 'rejected', 'delivered', 'All']

const OrdersPage = () => {
  const { darkMode } = useTheme()
  const { user: authUser } = useAuth()
  const fullName = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const userIc   = darkMode ? userDark : user

  const [orders, setOrders]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [dbError, setDbError]         = useState(null)
  const [activeFilter, setActiveFilter] = useState('New')
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenu, setOpenMenu]       = useState(null)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(err => setDbError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleStatusUpdate = async (id, status) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
    setOpenMenu(null)
    try {
      await updateOrderStatus(id, status)
    } catch {
      // revert on failure
      getOrders().then(setOrders)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      String(order._id).includes(q) ||
      (order.customer || '').toLowerCase().includes(q) ||
      (order.table_number || order.table || '').toLowerCase().includes(q) ||
      (order.phone || '').includes(q)
    return matchesFilter && matchesSearch
  })

  const summary = useMemo(() => [
    { icon: delivered, label: 'Delivered',  value: orders.filter(o => o.status === 'delivered').length, positive: true  },
    { icon: waiting,   label: 'Preparing',  value: orders.filter(o => o.status === 'preparing').length, positive: true  },
    { icon: rejected,  label: 'Rejected',   value: orders.filter(o => o.status === 'rejected').length,  positive: false },
    { icon: allOrders, label: 'All Orders', value: orders.length,                                        positive: true  },
  ], [orders])

  const topSelling = useMemo(() => {
    const counts = {}
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const key = item.name || 'Item'
        counts[key] = (counts[key] || 0) + (item.quantity || 1)
      })
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count, image: drink1 }))
  }, [orders])

  const formatPrice = (price) =>
    typeof price === 'number'
      ? `FRW ${price.toLocaleString()}`
      : price || '—'

  const statusColor = { pending: '#f59e0b', preparing: '#3B8019', delivered: '#4CAF50', rejected: '#e05252' }

  return (
    <div onClick={() => setOpenMenu(null)}>
      <SideBar />
      <div className={styles.mainOrders}>

        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.textOrders}>
            <p className={styles.pageTitle}>
              Operations/<span className={styles.pageTitleSub}>Orders</span>
            </p>
            <p className={styles.pageSubtitle}>Track and manage customer orders in real time</p>
          </div>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search orders, table, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <img className={styles.searchIcon} src={searchIc} alt="" />
          </div>
          <div className={styles.rightSide}>
            <img className={styles.bellIcon} src={bellIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        {/* Content */}
        <div className={styles.contentArea}>

          {/* Left: Orders List */}
          <div className={styles.leftPanel}>
            <div className={styles.filterTabs}>
              {filters.map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className={styles.ordersList}>
              {loading && <p className={styles.emptyState}>Loading orders...</p>}
              {dbError && <p className={styles.emptyState} style={{ color: 'red' }}>Error: {dbError}</p>}
              {!loading && !dbError && filteredOrders.length === 0 && (
                <p className={styles.emptyState}>No orders found.</p>
              )}
              {filteredOrders.map((order) => (
                <div key={order._id} className={styles.orderCard} style={{ position: 'relative' }}>
                  <img className={styles.orderImage} src={order.image_url || drink1} alt="" />
                  <div className={styles.orderMeta}>
                    <p className={styles.orderNum}>Order #{order._id}</p>
                    <p className={styles.orderTime}>{order.created_at ? new Date(order.created_at).toLocaleString() : '—'}</p>
                  </div>
                  <div className={styles.orderDetails}>
                    <p className={styles.orderIngredients}>{(order.items || []).map(i => i.name).join(', ') || '—'}</p>
                    <p className={styles.orderCustomer}>{(order.items || []).reduce((s, i) => s + i.quantity, 0)} item(s)</p>
                  </div>
                  <div className={styles.orderRight}>
                    <p className={styles.orderPrice}>{formatPrice(order.totalAmount)}</p>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: statusColor[order.status] }}>
                      {order.status}
                    </p>
                    <p className={styles.orderPhone}>{order.phone || '—'}</p>
                  </div>
                  <button className={styles.dotsBtn} onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === order._id ? null : order._id) }}>⋮</button>
                  {openMenu === order._id && (
                    <div onClick={e => e.stopPropagation()} style={{
                      position: 'absolute', right: '0.5rem', top: '100%', zIndex: 10,
                      background: 'var(--bg-card)', border: '1px solid var(--border-col)',
                      borderRadius: '0.6rem', padding: '0.4rem 0', minWidth: '11rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.18)', fontFamily: 'var(--body)'
                    }}>
                      {['pending', 'preparing', 'delivered', 'rejected'].map(s => (
                        <div key={s} onClick={() => handleStatusUpdate(order._id, s)} style={{
                          padding: '0.55rem 1rem', cursor: 'pointer', fontSize: '0.85rem',
                          color: statusColor[s], fontWeight: order.status === s ? 700 : 400,
                          background: order.status === s ? 'var(--bg-row)' : 'transparent'
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-row)'}
                          onMouseLeave={e => e.currentTarget.style.background = order.status === s ? 'var(--bg-row)' : 'transparent'}
                        >
                          {order.status === s ? '✓ ' : ''}{s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary Panel */}
          <div className={styles.rightPanel}>

            {/* Order Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>
                <img className={styles.summaryIcon} src={allOrders} alt="" />
                <p className={styles.summaryTitle}>Order Summary</p>
              </div>
              <div className={styles.statCards}>
                {summary.map((s, i) => (
                  <div key={i} className={styles.statCard}>
                    <img className={styles.statIcon} src={s.icon} alt="" />
                    <div className={styles.statText}>
                      <p className={styles.statLabel}>{s.label}</p>
                      <p className={styles.statValue}>{s.value}</p>
                    </div>
                    <svg className={styles.trendChart} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor={s.positive ? '#3B8019' : '#FD0404'} stopOpacity="0.75"/>
                          <stop offset="100%" stopColor={s.positive ? '#3B8019' : '#FD0404'} stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {s.positive ? (
                        <>
                          <path d="M0,34 C6,30 10,26 16,22 C20,19 23,25 28,20 C33,15 36,18 42,13 C47,9 50,14 55,10 C60,6 64,9 69,5 C73,3 77,2 80,1 L80,40 L0,40 Z" fill={`url(#grad-${i})`} />
                          <path d="M0,34 C6,30 10,26 16,22 C20,19 23,25 28,20 C33,15 36,18 42,13 C47,9 50,14 55,10 C60,6 64,9 69,5 C73,3 77,2 80,1" stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </>
                      ) : (
                        <>
                          <path d="M0,28 C4,24 6,30 10,22 C14,14 16,26 20,20 C24,14 26,28 30,18 C34,10 36,24 40,16 C44,8 46,22 50,16 C54,10 56,26 60,18 C64,12 68,22 72,16 C75,12 78,18 80,14 L80,40 L0,40 Z" fill={`url(#grad-${i})`} />
                          <path d="M0,28 C4,24 6,30 10,22 C14,14 16,26 20,20 C24,14 26,28 30,18 C34,10 36,24 40,16 C44,8 46,22 50,16 C54,10 56,26 60,18 C64,12 68,22 72,16 C75,12 78,18 80,14" stroke="#FD0404" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </>
                      )}
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Items */}
            <div className={styles.topSellingCard}>
              <div className={styles.topSellingHeader}>
                <img className={styles.fireIcon} src={fire} alt="" />
                <p className={styles.topSellingTitle}>Top Selling Items</p>
              </div>
              {topSelling.length === 0 && !loading && (
                <p style={{ padding: '0.5rem 0', opacity: 0.5, fontSize: '0.85rem' }}>No data yet.</p>
              )}
              {topSelling.map((item, i) => (
                <div key={i} className={styles.topSellingItem}>
                  <img className={styles.topSellingImage} src={item.image} alt="" />
                  <div>
                    <p className={styles.topSellingName}>{item.name}</p>
                    <p className={styles.topSellingCount}>{item.count} orders</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersPage
