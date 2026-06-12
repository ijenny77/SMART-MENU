import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import crown from '../assets/crown 1.png'
import settings from '../assets/sidebarClientSide/settings.png'
import dashboard from '../assets/sidebarClientSide/dashboard.png'
import activeDashboard from '../assets/sidebarClientSide/activeDashboard.png'
import restaurants from '../assets/sidebarClientSide/restaurants.png'
import activeRestaurants from '../assets/sidebarClientSide/activeRestaurants.png'
import menu from '../assets/sidebarClientSide/menu.png'
import activeMenu from '../assets/sidebarClientSide/activeMenu.png'
import myOrders from '../assets/sidebarClientSide/myOrders.png'
import activeMyOrders from '../assets/sidebarClientSide/activeMyOrders.png'
import activeSettings from '../assets/sidebarClientSide/activeSettings.png'
import styles from './SideBarClient.module.css'

const navItems = [
  { icon: dashboard,   activeIcon: activeDashboard,   label: 'Dashboard',   route: '/ClientDashboard' },
  { icon: restaurants, activeIcon: activeRestaurants, label: 'Restaurants', route: '/clientRestaurants' },
  { icon: menu,        activeIcon: activeMenu,        label: 'Menu',        route: '/clientMenu' },
  { icon: myOrders,    activeIcon: activeMyOrders,    label: 'My orders',   route: '/clientOrders' },
]

const bottomItems = [
  { icon: settings, activeIcon: activeSettings, label: 'Settings', route: '/clientSettings' },
]

const SideBarClient = () => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, signOut } = useAuth()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const fullName     = user?.name || user?.email?.split('@')[0] || 'User'
  const email        = user?.email || ''
  const avatarUrl    = ''
  const avatarLetter = fullName.charAt(0).toUpperCase()

  /* Close popup when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (route) => location.pathname === route

  const handleLogout = async () => {
    setMenuOpen(false)
    await signOut()
    navigate('/login')
  }

  const go = (path) => { setMenuOpen(false); navigate(path) }

  const NavItem = ({ icon, activeIcon, label, route }) => {
    const active = isActive(route)
    return (
      <div
        className={`${styles.navItem} ${active ? styles.active : ''}`}
        onClick={() => navigate(route)}
      >
        <div className={styles.navIcon}>
          <img
            src={activeIcon && active ? activeIcon : icon}
            alt=""
            className={active && !activeIcon ? styles.activeIconFilter : ''}
          />
        </div>
        {label}
      </div>
    )
  }

  return (
    <div className={styles.mainSideBar}>
      <Link to='/' className={styles.logo}>SMART MENU</Link>

      <nav className={styles.navGroup}>
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className={styles.divider}>
        {bottomItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}

        <div className={styles.upgradeCard}>
          <img src={crown} alt="" />
          <p className={styles.upgradeTitle}>Upgrade to Pro</p>
          <p className={styles.upgradeDesc}>Unlock more features and insights.</p>
          <button
            className={styles.upgradeBtn}
            onClick={() => navigate('/clientSettings')}
          >
            Upgrade Now →
          </button>
        </div>

        {/* ── User profile card ── */}
        <div className={styles.userCard} ref={menuRef}>
          <div className={styles.userCardInner} onClick={() => setMenuOpen(p => !p)}>
            <div className={styles.userAvatar}>
              {avatarUrl
                ? <img src={avatarUrl} alt="" className={styles.userAvatarImg} />
                : <span className={styles.userAvatarLetter}>{avatarLetter}</span>
              }
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{fullName}</p>
              <p className={styles.userEmail}>{email}</p>
            </div>
            <svg className={styles.userChevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </div>

          {/* ── Popup menu (opens upward) ── */}
          {menuOpen && (
            <div className={styles.userPopup}>
              <div className={styles.popupHeader}>
                <div className={styles.popupAvatar}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="" className={styles.userAvatarImg} />
                    : <span className={styles.userAvatarLetter}>{avatarLetter}</span>
                  }
                </div>
                <div>
                  <p className={styles.popupName}>{fullName}</p>
                  <p className={styles.popupEmail}>{email}</p>
                </div>
              </div>

              <div className={styles.popupDivider} />

              <button className={styles.popupItem} onClick={() => go('/clientAccount')}>
                <svg className={styles.popupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                My Account
              </button>

              <button className={styles.popupItem} onClick={() => go('/clientSettings')}>
                <svg className={styles.popupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </button>

              <div className={styles.popupDivider} />

              <button className={`${styles.popupItem} ${styles.popupLogout}`} onClick={handleLogout}>
                <svg className={styles.popupIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SideBarClient
