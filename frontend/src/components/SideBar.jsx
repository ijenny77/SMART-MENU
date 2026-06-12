import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import operations from '../assets/sidebarIcons/Group 131.png'
import overview from '../assets/sidebarIcons/Group 71.png'
import clients from '../assets/sidebarIcons/Group 66.png'
import settings from '../assets/Settings.png'
import account from '../assets/account.png'
import crown from '../assets/crown 1.png'
import styles from './SideBar.module.css'
import client from '../assets/sidebarIcons/Group 72.png'
import activeOverview from '../assets/sidebarIcons/activeOverview.png'
import activeClient from '../assets/sidebarIcons/activeClient.png'
import activeOperations from '../assets/sidebarIcons/activeOperations.png'
import activeSettings from '../assets/sidebarIcons/activeSettings.png'
import activeAccount from '../assets/sidebarIcons/activeAccount.png'

const navItems = [
  { icon: overview,    activeIcon: activeOverview,    label: 'Overview',    route: '/overview' },
  { icon: client,      activeIcon: activeClient,      label: 'Clients',     route: '/ClientsListPage' },
  { icon: operations,  activeIcon: activeOperations,  label: 'Operations',  route: '/OperationsPage' },
]

const bottomItems = [
  { icon: settings, activeIcon: activeSettings, label: 'Settings',   route: '/settings' },
  { icon: account,  activeIcon: activeAccount,  label: 'My account', route: '/account' },
]

const SideBar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (route, label) => {
    if (label === 'Operations') return ['/OperationsPage', '/MenusPage', '/OrdersPage'].includes(location.pathname)
    return location.pathname === route
  }

  const NavItem = ({ icon, activeIcon, label, route }) => {
    const active = isActive(route, label)
    return (
      <div
        className={`${styles.navItem} ${active ? styles.active : ''}`}
        onClick={() => navigate(route)}
      >
        <div className={styles.navIcon}>
          <img src={active ? activeIcon : icon} alt="" />
        </div>
        {label}
      </div>
    )
  }

  return (
    <div className={styles.mainSideBar}>
      <Link to='/' className={styles.logo}>SMART MENU</Link>
      {navItems.map((item) => <NavItem key={item.label} {...item} />)}
      <div className={styles.divider}>
        {bottomItems.map((item) => <NavItem key={item.label} {...item} />)}
        <div className={styles.upgradeCard}>
          <img src={crown} alt="" />
          <p className={styles.upgradeTitle}>Upgrade to Pro</p>
          <p className={styles.upgradeDesc}>Unlock more features and insights.</p>
          <button className={styles.upgradeBtn} onClick={() => navigate('/settings')}>Upgrade Now →</button>
        </div>
      </div>
    </div>
  )
}

export default SideBar
