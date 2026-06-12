import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../../SideBar'
import search         from '../../../assets/Search1.png'
import searchLight    from '../../../assets/searchLight.png'
import bell           from '../../../assets/Group 391.png'
import notifLight     from '../../../assets/notificationLight.png'
import line           from '../../../assets/line.png'
import lineLight      from '../../../assets/lineLight.png'
import userImg        from '../../../assets/userLight.png'
import userDark       from '../../../assets/User.png'
import { useTheme }   from '../../../context/ThemeContext'
import { useAuth }    from '../../../context/AuthContext'
import ordersIc from '../../../assets/Group 331.png'
import revenueIc from '../../../assets/Group 332.png'
import clientIc from '../../../assets/clients.png'
import styles   from './OverviewPage.module.css'
import hotels from '../../../assets/hotels.png'
import orders from '../../../assets/orders.png'
import pubs from '../../../assets/pubs.png'
import set from '../../../assets/set.png'
import add from '../../../assets/add.png'
import dishCover from '../../../assets/dishCover.png'
import { getOrders } from '../../../services/orderService'
import { getMenuItems } from '../../../services/menuService'
import { getClients } from '../../../services/clientService'
import UserMenu from '../../UserMenu'

const createOptions = [
  { label: 'Restaurants', badge: 'NEW',     checked: false },
  { label: 'Hotels',      badge: 'NEW',     checked: false },
  { label: 'Pub',         badge: 'DEFAULT', checked: true  },
]

const timeTabs = ['Today', 'Week', 'Month', 'Year']

const GREEN_AREA =
  'M0,185 C20,180 35,155 55,120 C75,85 90,105 110,130 C130,155 145,140 165,100 C185,60 205,25 225,35 C245,45 265,100 285,120 C305,140 325,155 350,160 L350,200 L0,200 Z'
const GREEN_LINE =
  'M0,185 C20,180 35,155 55,120 C75,85 90,105 110,130 C130,155 145,140 165,100 C185,60 205,25 225,35 C245,45 265,100 285,120 C305,140 325,155 350,160'
const WHITE_LINE =
  'M0,150 C30,145 55,115 80,135 C105,155 125,105 150,95 C175,85 195,130 220,110 C245,90 270,120 295,100 C315,85 335,115 350,105'

const Y_LABELS = [60, 50, 40, 30, 20, 10, 0]

const CATEGORY_META = [
  { key: 'RESTO', label: 'Restaurants', iconSrc: set    },
  { key: 'HOTEL', label: 'Hotels',      iconSrc: hotels },
  { key: 'BAR',   label: 'Pubs',        iconSrc: pubs   },
  { key: 'CAFE',  label: 'Cafes',       iconSrc: orders },
]

const OverviewPage = () => {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const fullName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()

  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const lineIc   = darkMode ? line   : lineLight
  const userIc   = darkMode ? userDark : userImg

  const [clientCount,  setClientCount]  = useState(null)
  const [orderCount,   setOrderCount]   = useState(null)
  const [totalRevenue, setTotalRevenue] = useState(null)
  const [menuCount,    setMenuCount]    = useState(null)
  const [allClients,   setAllClients]   = useState([])

  const [activeTab, setActiveTab] = useState('Today')
  const [selected,  setSelected]  = useState(2)
  const [hover,     setHover]     = useState(null)
  const greenRef = useRef(null)
  const whiteRef = useRef(null)
  const svgRef   = useRef(null)

  useEffect(() => {
    const fetchAll = async () => {
      const [clients, ordersData, menus] = await Promise.all([
        getClients().catch(() => []),
        getOrders().catch(() => []),
        getMenuItems().catch(() => []),
      ])
      setClientCount(clients.length)
      setOrderCount(ordersData.length)
      setTotalRevenue(ordersData.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0))
      setMenuCount(menus.length)
      setAllClients(clients)
    }
    fetchAll()
  }, [])

  const topStats = [
    { icon: clientIc,   label: 'Clients',   value: clientCount  === null ? '…' : clientCount.toLocaleString()  },
    { icon: revenueIc,  label: 'Revenue',   value: totalRevenue === null ? '…' : `${totalRevenue.toLocaleString()} FRW` },
    { icon: ordersIc,   label: 'Orders',    value: orderCount   === null ? '…' : orderCount.toLocaleString()   },
  ]

  const sideStats = [
    { label: 'Orders',     value: orderCount   === null ? '…' : orderCount.toLocaleString()   },
    { label: 'Menu Items', value: menuCount    === null ? '…' : menuCount.toLocaleString()    },
    { label: 'Revenue',    value: totalRevenue === null ? '…' : `${totalRevenue.toLocaleString()}` },
    { label: 'Clients',    value: clientCount  === null ? '…' : clientCount.toLocaleString()  },
  ]

  const categories = useMemo(() => {
    return CATEGORY_META.map(meta => {
      const items = allClients
        .filter(c => c.category === meta.key)
        .slice(0, 2)
        .map(c => ({ name: c.name, sales: c.sales ? Number(c.sales).toLocaleString() : '—' }))
      return { ...meta, items }
    })
  }, [allClients])

  const getYAtX = (pathEl, targetX) => {
    if (!pathEl) return null
    const len = pathEl.getTotalLength()
    let lo = 0, hi = len
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2
      const pt  = pathEl.getPointAtLength(mid)
      if (Math.abs(pt.x - targetX) < 0.3) return pt.y
      pt.x < targetX ? (lo = mid) : (hi = mid)
    }
    return pathEl.getPointAtLength((lo + hi) / 2).y
  }

  const handleMouseMove = (e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect   = svg.getBoundingClientRect()
    const scaleX = 350 / rect.width
    const svgX   = (e.clientX - rect.left) * scaleX
    if (svgX < 0 || svgX > 350) return
    const gY = getYAtX(greenRef.current, svgX)
    const wY = getYAtX(whiteRef.current, svgX)
    const toVal = y => Math.round(((200 - y) / 200) * 60)
    setHover({ x: svgX, gY, wY, gVal: toVal(gY), wVal: toVal(wY) })
  }

  const tipX = (x) => Math.min(Math.max(x - 35, 2), 278)

  return (
    <div>
      <SideBar />
      <div className={styles.main}>

        {/* ── Top Bar ── */}
        <div className={styles.topBar}>
          <div>
            <p className={styles.pageTitle}>Overview</p>
            <p className={styles.pageSubtitle}>Here's what's happening with your Restaurant Today</p>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.icon}     src={searchIc} alt="" />
            <img className={styles.icon}     src={bellIc}   alt="" />
            <img className={styles.lineIcon} src={lineIc}   alt="" />
            <p  className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        {/* ── Top Stat Cards ── */}
        <div className={styles.statCards}>
          {topStats.map((s) => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statCardTop}>
                <div className={styles.statIconWrap}>
                  <img src={s.icon} alt="" className={styles.statIconImg} />
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
                <span className={styles.dots}>···</span>
              </div>
              <p className={styles.statValue}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Chart + Side Stats ── */}
        <div className={styles.chartRow}>

          {/* Chart card */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <p className={styles.chartTitle}>Today's trends</p>
                <p className={styles.chartSub}>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className={styles.timeTabs}>
                {timeTabs.map(t => (
                  <button
                    key={t}
                    className={`${styles.timeTab} ${activeTab === t ? styles.timeTabActive : ''}`}
                    onClick={() => setActiveTab(t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className={styles.chartWrap}>
              <div className={styles.yAxis}>
                {Y_LABELS.map(v => <span key={v} className={styles.yLabel}>{v}</span>)}
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 350 200"
                className={styles.chartSvg}
                preserveAspectRatio="none"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'crosshair' }}
              >
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#3B8019" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#3B8019" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {[0,33,67,100,133,167,200].map(y => (
                  <line key={y} x1="0" y1={y} x2="350" y2={y} stroke="#2a2a2a" strokeWidth="0.5" />
                ))}
                <path d={GREEN_AREA} fill="url(#greenGrad)" />
                <path ref={greenRef} d={GREEN_LINE} fill="none" stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path ref={whiteRef} d={WHITE_LINE} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                {hover && (
                  <>
                    <line x1={hover.x} y1="0" x2={hover.x} y2="200" stroke="#555" strokeWidth="1" strokeDasharray="4 3" />
                    <circle cx={hover.x} cy={hover.gY} r="4" fill="#4CAF50" stroke="#fff" strokeWidth="1.2" />
                    <circle cx={hover.x} cy={hover.wY} r="4" fill="#fff"    stroke="#4CAF50" strokeWidth="1.2" />
                    <rect x={tipX(hover.x)} y={Math.min(hover.gY, hover.wY) - 46} width="70" height="42" rx="5" fill="#1a1a1a" stroke="#3a3a3a" strokeWidth="0.8" />
                    <circle cx={tipX(hover.x) + 8} cy={Math.min(hover.gY, hover.wY) - 34} r="3" fill="#4CAF50" />
                    <text x={tipX(hover.x) + 15} y={Math.min(hover.gY, hover.wY) - 30} fill="#4CAF50" fontSize="8" fontFamily="sans-serif">Today: {hover.gVal}</text>
                    <circle cx={tipX(hover.x) + 8} cy={Math.min(hover.gY, hover.wY) - 18} r="3" fill="#ccc" />
                    <text x={tipX(hover.x) + 15} y={Math.min(hover.gY, hover.wY) - 14} fill="#ccc" fontSize="8" fontFamily="sans-serif">Prev: {hover.wVal}</text>
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Side stats */}
          <div className={styles.sideStats}>
            {sideStats.map((s, i) => (
              <div key={s.label} className={`${styles.sideStat} ${i < sideStats.length - 1 ? styles.sideStatBorder : ''}`}>
                <p className={styles.sideStatLabel}>{s.label}</p>
                <p className={styles.sideStatValue}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Section ── */}
        <div className={styles.bottomRow}>

          {/* 4-card operational stats */}
          <div className={styles.opsGrid}>

            {/* Schedules */}
            <div className={styles.opsCard}>
              <div className={styles.opsCardTop}>
                <div className={styles.opsIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    <rect x="8" y="14" width="2" height="2" rx="0.3"/><rect x="13" y="14" width="2" height="2" rx="0.3"/>
                  </svg>
                </div>
                <span className={styles.viewDetails} onClick={() => navigate('/OperationsPage')}>View details</span>
              </div>
              <p className={styles.opsValue}>{orderCount ?? '…'}</p>
              <p className={styles.opsLabel}>Schedules</p>
              <p className={styles.opsSub}>Active today</p>
              <div className={styles.opsFooter} onClick={() => navigate('/OperationsPage')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--greentree)' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span className={styles.opsLink}>View calendar</span>
              </div>
            </div>

            {/* Staff */}
            <div className={styles.opsCard}>
              <div className={styles.opsCardTop}>
                <div className={styles.opsIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span className={styles.viewDetails} onClick={() => navigate('/ClientsListPage')}>View details</span>
              </div>
              <p className={styles.opsValue}>{clientCount ?? '…'}</p>
              <p className={styles.opsLabel}>Staff</p>
              <p className={styles.opsSub}>Employees online</p>
              <div className={styles.opsFooter} onClick={() => navigate('/ClientsListPage')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--greentree)' }}>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                <span className={styles.opsLink}>View team</span>
              </div>
            </div>

            {/* Inventory */}
            <div className={styles.opsCard}>
              <div className={styles.opsCardTop}>
                <div className={styles.opsIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <span className={styles.viewDetails} onClick={() => navigate('/MenusPage')}>View details</span>
              </div>
              <p className={styles.opsValue}>{menuCount ?? '…'}</p>
              <p className={styles.opsLabel}>Inventory</p>
              <p className={styles.opsSub}>Items in stock</p>
              <div className={styles.opsFooter} onClick={() => navigate('/MenusPage')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--greentree)' }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <span className={styles.opsLink}>View inventory</span>
              </div>
            </div>

            {/* Reports */}
            <div className={styles.opsCard}>
              <div className={styles.opsCardTop}>
                <div className={styles.opsIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <span className={styles.viewDetails} onClick={() => navigate('/OrdersPage')}>View details</span>
              </div>
              <p className={styles.opsValue}>{orderCount ?? '…'}</p>
              <p className={styles.opsLabel}>Reports</p>
              <p className={styles.opsSub}>Reports pending</p>
              <div className={styles.opsFooter} onClick={() => navigate('/OrdersPage')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--greentree)' }}>
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span className={styles.opsLink}>View reports</span>
              </div>
            </div>

          </div>

          {/* Create card */}
          <div className={styles.createCard}>
            <div className={styles.createHeader}>
              <div>
                <p className={styles.createTitle}>Create</p>
                <p className={styles.createSub}>today</p>
              </div>
              <span className={styles.viewAll} onClick={() => navigate('/ClientsListPage')} style={{ cursor: 'pointer' }}>View all</span>
            </div>

            <div className={styles.createNew}>
              <span className={styles.createNewLabel}>Create new</span>
              <img src={add} alt="add" className={styles.addImg} onClick={() => navigate('/Onboarding1')} style={{ cursor: 'pointer' }} />
            </div>

            <div className={styles.createOptions}>
              {createOptions.map((opt, i) => (
                <div key={opt.label} className={styles.createOption} onClick={() => setSelected(i)}>
                  <div className={`${styles.radioCircle} ${selected === i ? styles.radioChecked : ''}`}>
                    {selected === i && <span className={styles.radioTick}>✓</span>}
                  </div>
                  <span className={styles.optionLabel}>{opt.label}</span>
                  <span className={`${styles.optionBadge} ${opt.badge === 'DEFAULT' ? styles.badgeDefault : styles.badgeNew}`}>
                    {opt.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.createBottom}>
              <img src={dishCover} alt="" className={styles.dishCoverImg} />
              <p className={styles.createBottomTitle}>Manage all your businesses in one place.</p>
              <p className={styles.createBottomSub}>Stay organized and in control.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default OverviewPage
