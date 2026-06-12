import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../../SideBar'
import food from '../../../assets/food.png'
import orders from '../../../assets/Group 331.png'
import revenue from '../../../assets/Group 332.png'
import menuIcon from '../../../assets/Group 333.png'
import cover from '../../../assets/Group 334.png'
import listOrders from '../../../assets/Group 337.png'
import bag from '../../../assets/Group 338.png'
import search      from '../../../assets/Search1.png'
import searchLight from '../../../assets/searchLight.png'
import bell        from '../../../assets/Group 391.png'
import notifLight  from '../../../assets/notificationLight.png'
import line        from '../../../assets/line.png'
import lineLight   from '../../../assets/lineLight.png'
import user        from '../../../assets/userLight.png'
import userDark    from '../../../assets/User.png'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import styles from './OperationsPage.module.css'
import Button from '../../ui/Button'
import notification from '../../../assets/alerts.png'
import checkmark from '../../../assets/checkmark.png'
import alert from '../../../assets/alerting.png'
import { getOrders } from '../../../services/orderService'
import { getMenuItems } from '../../../services/menuService'
import UserMenu from '../../UserMenu'

const OperationsPage = () => {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const { user: authUser } = useAuth()
  const fullName = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const lineIc   = darkMode ? line   : lineLight
  const userIc   = darkMode ? userDark : user

  const [stats, setStats] = useState([
    { icon: orders,   label: 'Orders Today',     value: '…', badge: '' },
    { icon: revenue,  label: 'Revenue Today',     value: '…', badge: '' },
    { icon: menuIcon, label: 'Active Menu Items', value: '…', badge: '' },
  ])

  const [alerts, setAlerts] = useState([])

  const operations = [
    { icon: cover,      label: 'Menus',  text: 'Create, update and manage your food items and categories', buttonText: 'Manage Menus →',  image: food, route: '/MenusPage' },
    { icon: listOrders, label: 'Orders', text: 'Track, manage and fulfill customer orders in real time.',  buttonText: 'Manage Orders →', image: bag,  route: '/OrdersPage' },
  ]

  useEffect(() => {
    const fetchStats = async () => {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)

      const [allOrders, allMenus] = await Promise.all([
        getOrders().catch(() => []),
        getMenuItems().catch(() => []),
      ])

      const todayOrders   = allOrders.filter(o => new Date(o.createdAt) >= todayStart)
      const todayRevenue  = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
      const pendingCount  = allOrders.filter(o => o.status === 'pending').length
      const rejectedCount = allOrders.filter(o => o.status === 'rejected').length
      const menuTotal     = allMenus.length

      setStats([
        { icon: orders,   label: 'Orders Today',     value: String(todayOrders.length), badge: '' },
        { icon: revenue,  label: 'Revenue Today',    value: `FRW ${todayRevenue.toLocaleString()}`, badge: '' },
        { icon: menuIcon, label: 'Active Menu Items', value: String(menuTotal), badge: '' },
      ])

      const dynamicAlerts = []
      if (pendingCount > 0)
        dynamicAlerts.push({ type: 'warning', text: `${pendingCount} order${pendingCount > 1 ? 's' : ''} waiting to be fulfilled` })
      if (rejectedCount > 0)
        dynamicAlerts.push({ type: 'warning', text: `${rejectedCount} order${rejectedCount > 1 ? 's' : ''} were rejected` })
      if (menuTotal === 0)
        dynamicAlerts.push({ type: 'warning', text: 'No menu items added yet' })
      if (dynamicAlerts.length === 0)
        dynamicAlerts.push({ type: 'success', text: 'All systems running normally' })
      setAlerts(dynamicAlerts)
    }
    fetchStats()
  }, [])

  return (
    <div>
      <SideBar/>
      <div className={styles.mainOperations}>
        <div style={{display:'flex',gap:'31rem'}}>
          <div className={styles.textOperations}>
            <p style={{fontWeight:'900',fontSize:'1.2rem'}}>Operations</p>
            <p>Manage your restaurant in one place</p>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.icons} src={searchIc} alt="" />
            <img className={styles.icons} src={bellIc} alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>
        <div className={styles.statsBoxes}>
          {stats.map((s) => (
            <div key={s.label} className={styles.statsCard}>
              <img className={styles.statsImg} src={s.icon} alt="" />
              <div className={styles.textStats}>
                <p className={styles.labelStats}>{s.label}</p>
                <p className={styles.valueStats}>{s.value}</p>
                {s.badge && <p className={styles.badgeStats}>{s.badge}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.operationsBoxes}>
          {operations.map((o) => (
            <div key={o.label} className={styles.operationCard}>
              <img className={styles.operationsImage} src={o.icon} alt="" />
              <div className={styles.operationsTexts}>
                <p className={styles.operationsLabel}>{o.label}</p>
                <p className={styles.operationsText}>{o.text}</p>
                <Button className={styles.operationsButton} onClick={() => navigate(o.route)}>{o.buttonText}</Button>
              </div>
              <img className={styles.realOperationsImage} src={o.image} alt="" />
            </div>
          ))}
        </div>
        <div className={styles.alertsSection}>
          <div className={styles.alertsHeader}>
            <img className={styles.alertBell} src={notification} alt="" />
            <p className={styles.alertsTitle}>Operational Alerts</p>
          </div>
          {alerts.map((a, index) => (
            <div key={index} className={styles.alertRow}>
              <img className={styles.alertIcon} src={a.type === 'warning' ? alert : checkmark} alt="" />
              <p className={styles.alertText}>{a.text}</p>
              <span className={styles.alertArrow}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OperationsPage
