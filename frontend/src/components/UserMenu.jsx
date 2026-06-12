import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './UserMenu.module.css'

const UserMenu = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const fullName    = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName   = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const avatarUrl   = null

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    setOpen(false)
    await signOut()
    navigate('/login')
  }

  const go = (path) => { setOpen(false); navigate(path) }

  const isClient = user?.role === 'client'
  const accountPath  = isClient ? '/clientAccount'  : '/account'
  const settingsPath = isClient ? '/clientSettings' : '/settings'

  return (
    <div className={styles.wrapper} ref={ref}>

      {/* ── Avatar trigger ── */}
      <button className={styles.avatarBtn} onClick={() => setOpen(p => !p)}>
        {avatarUrl
          ? <img src={avatarUrl} alt="" className={styles.avatarImg} />
          : <span className={styles.avatarLetter}>{avatarLetter}</span>
        }
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className={styles.dropdown}>

          {/* User info header */}
          <div className={styles.dropHeader}>
            <div className={styles.dropAvatar}>
              {avatarUrl
                ? <img src={avatarUrl} alt="" className={styles.avatarImg} />
                : <span className={styles.avatarLetter}>{avatarLetter}</span>
              }
            </div>
            <div>
              <p className={styles.dropName}>{fullName}</p>
              <p className={styles.dropEmail}>{user?.email}</p>
            </div>
          </div>

          <div className={styles.divider} />

          {/* Menu items */}
          <button className={styles.item} onClick={() => go(accountPath)}>
            <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            My Account
          </button>

          <button className={styles.item} onClick={() => go(settingsPath)}>
            <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Settings
          </button>

          <button className={styles.item} onClick={() => setOpen(false)}>
            <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Help
          </button>

          <div className={styles.divider} />

          <button className={`${styles.item} ${styles.itemLogout}`} onClick={handleLogout}>
            <svg className={styles.itemIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>

        </div>
      )}
    </div>
  )
}

export default UserMenu
