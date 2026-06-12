import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'
import SideBar from '../../SideBar'
import search      from '../../../assets/Search1.png'
import searchLight from '../../../assets/searchLight.png'
import bell        from '../../../assets/Group 391.png'
import notifLight  from '../../../assets/notificationLight.png'
import line        from '../../../assets/line.png'
import lineLight   from '../../../assets/lineLight.png'
import user        from '../../../assets/userLight.png'
import userDark    from '../../../assets/User.png'
import styles from './SettingsPage.module.css'
import UserMenu from '../../UserMenu'

const Toggle = ({ value, onChange }) => (
  <div className={`${styles.toggle} ${value ? styles.toggleOn : ''}`} onClick={() => onChange(!value)}>
    <div className={styles.toggleThumb} />
  </div>
)

const settingsItems = [
  {
    label: 'General',
    sub: 'Configure general preferences',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    content: ({ prefs, setPrefs }) => (
      <div className={styles.panelGrid}>
        <div className={styles.panelField}>
          <label className={styles.panelLabel}>Language</label>
          <select className={styles.panelSelect} value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value }))}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="rw">Kinyarwanda</option>
          </select>
        </div>
        <div className={styles.panelField}>
          <label className={styles.panelLabel}>Timezone</label>
          <select className={styles.panelSelect} value={prefs.timezone} onChange={e => setPrefs(p => ({ ...p, timezone: e.target.value }))}>
            <option value="CAT">Africa/Kigali (CAT)</option>
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
          </select>
        </div>
        <div className={styles.panelField}>
          <label className={styles.panelLabel}>Currency</label>
          <select className={styles.panelSelect} value={prefs.currency} onChange={e => setPrefs(p => ({ ...p, currency: e.target.value }))}>
            <option value="FRW">Rwandan Franc (FRW)</option>
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
        <div className={styles.panelField}>
          <label className={styles.panelLabel}>Date Format</label>
          <select className={styles.panelSelect} value={prefs.dateFormat} onChange={e => setPrefs(p => ({ ...p, dateFormat: e.target.value }))}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    ),
  },
  {
    label: 'Notifications',
    sub: 'Manage how you receive updates',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    content: ({ prefs, setPrefs }) => (
      <div className={styles.panelToggles}>
        {[
          { key: 'emailNotif',  label: 'Email notifications',  desc: 'Receive updates via email' },
          { key: 'pushNotif',   label: 'Push notifications',   desc: 'Browser push alerts' },
          { key: 'smsNotif',    label: 'SMS alerts',           desc: 'Critical alerts via SMS' },
          { key: 'weeklyReport',label: 'Weekly report',        desc: 'Summary email every Monday' },
        ].map(({ key, label, desc }) => (
          <div key={key} className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>{label}</p>
              <p className={styles.toggleDesc}>{desc}</p>
            </div>
            <Toggle value={prefs[key]} onChange={v => setPrefs(p => ({ ...p, [key]: v }))} />
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Users & Roles',
    sub: 'Manage users and permissions',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    content: () => (
      <div className={styles.panelToggles}>
        {[
          { name: 'Jenny (You)', role: 'Admin',   email: 'jenny@smartmenu.rw' },
          { name: 'Jean Paul',   role: 'Manager', email: 'jp@smartmenu.rw' },
          { name: 'Amina K.',    role: 'Staff',   email: 'amina@smartmenu.rw' },
        ].map(u => (
          <div key={u.name} className={styles.userRow}>
            <div className={styles.userAvatar}>{u.name[0]}</div>
            <div className={styles.userInfo}>
              <p className={styles.toggleLabel}>{u.name}</p>
              <p className={styles.toggleDesc}>{u.email}</p>
            </div>
            <span className={styles.roleBadge}>{u.role}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'Billing',
    sub: 'Manage your subscription and payments',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    content: ({ handleUpgrade, handleAddCard }) => (
      <div className={styles.panelToggles}>
        <div className={styles.billingPlan}>
          <div>
            <p className={styles.toggleLabel}>Current Plan — <span style={{ color: 'var(--green)' }}>Free</span></p>
            <p className={styles.toggleDesc}>Up to 1 restaurant, basic features</p>
          </div>
          <button className={styles.upgradeBtn} onClick={handleUpgrade}>Upgrade to Pro →</button>
        </div>
        <div className={styles.billingPlan}>
          <div>
            <p className={styles.toggleLabel}>Payment Method</p>
            <p className={styles.toggleDesc}>No card on file</p>
          </div>
          <button className={styles.addCardBtn} onClick={handleAddCard}>+ Add Card</button>
        </div>
      </div>
    ),
  },
  {
    label: 'Integrations',
    sub: 'Connect with third-party services',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    content: ({ prefs, setPrefs }) => (
      <div className={styles.panelToggles}>
        {[
          { key: 'stripe',     label: 'Stripe',      desc: 'Payment processing' },
          { key: 'mailchimp',  label: 'Mailchimp',   desc: 'Email marketing campaigns' },
          { key: 'whatsapp',   label: 'WhatsApp',    desc: 'Customer messaging' },
          { key: 'googleAnalytics', label: 'Google Analytics', desc: 'Website analytics' },
        ].map(({ key, label, desc }) => (
          <div key={key} className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>{label}</p>
              <p className={styles.toggleDesc}>{desc}</p>
            </div>
            <Toggle value={prefs[key]} onChange={v => setPrefs(p => ({ ...p, [key]: v }))} />
          </div>
        ))}
      </div>
    ),
  },
  {
    label: 'System',
    sub: 'System preferences and security',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    content: ({ prefs, setPrefs, darkMode, toggleDarkMode, handleExportCSV }) => (
      <div className={styles.panelToggles}>
        {[
          { key: 'twoFactor', label: 'Two-factor authentication', desc: 'Require 2FA on login' },
        ].map(({ key, label, desc }) => (
          <div key={key} className={styles.toggleRow}>
            <div>
              <p className={styles.toggleLabel}>{label}</p>
              <p className={styles.toggleDesc}>{desc}</p>
            </div>
            <Toggle value={prefs[key]} onChange={v => setPrefs(p => ({ ...p, [key]: v }))} />
          </div>
        ))}
        <div className={styles.toggleRow}>
          <div>
            <p className={styles.toggleLabel}>Dark mode</p>
            <p className={styles.toggleDesc}>Always use dark theme</p>
          </div>
          <Toggle value={darkMode} onChange={toggleDarkMode} />
        </div>
        <div className={styles.billingPlan}>
          <div>
            <p className={styles.toggleLabel}>Export Data</p>
            <p className={styles.toggleDesc}>Download all your restaurant data</p>
          </div>
          <button className={styles.addCardBtn} onClick={handleExportCSV}>Export CSV</button>
        </div>
      </div>
    ),
  },
]

const SettingsPage = () => {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const { user } = useAuth()
  const fullName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const displayEmail = user?.email || ''
  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const lineIc   = darkMode ? line   : lineLight
  const userIc   = darkMode ? userDark : user
  const [openIndex, setOpenIndex] = useState(null)
  const [toast, setToast] = useState(null)

  const [restaurantName, setRestaurantName] = useState(user?.restaurantName || '')
  const [savingProfile, setSavingProfile]   = useState(false)

  const handleSaveProfile = async () => {
    if (!restaurantName.trim()) return
    setSavingProfile(true)
    try {
      await api.patch('/users/profile', { restaurantName: restaurantName.trim() })
      showToast('Restaurant name updated!')
    } catch (err) {
      showToast('Failed to update: ' + err.message)
    } finally {
      setSavingProfile(false)
    }
  }
  const [prefs, setPrefs] = useState({
    language: 'en', timezone: 'CAT', currency: 'FRW', dateFormat: 'DD/MM/YYYY',
    emailNotif: true, pushNotif: false, smsNotif: false, weeklyReport: true,
    stripe: false, mailchimp: false, whatsapp: true, googleAnalytics: false,
    twoFactor: false,
  })

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpgrade = () => showToast('Upgrade to Pro — coming soon!')
  const handleAddCard = () => showToast('Payment card setup coming soon!')
  const handleExportCSV = () => {
    const rows = [['Setting', 'Value'], ...Object.entries(prefs)]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'smartmenu-settings.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('Settings exported!')
  }

  return (
    <div>
      <SideBar />
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-card)', border: '1px solid var(--border-col)',
          color: 'var(--text-main)', padding: '0.75rem 1.5rem', borderRadius: '0.7rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 999, fontFamily: 'var(--body)',
          fontSize: '0.9rem', fontWeight: 500
        }}>
          {toast}
        </div>
      )}
      <div className={styles.main}>

        {/* Top Bar */}
        <div className={styles.topBar}>
          <div>
            <p className={styles.pageTitle}>Settings</p>
            <p className={styles.pageSubtitle}>Manage your preferences and system settings</p>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.icon} src={searchIc} alt="" />
            <img className={styles.icon} src={bellIc} alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        <div className={styles.contentArea}>

          {/* Settings List */}
          <div className={styles.settingsList}>
            {settingsItems.map((item, i) => (
              <div key={item.label} className={`${styles.settingsRow} ${openIndex === i ? styles.open : ''}`}>
                <div className={styles.rowHeader} onClick={() => toggle(i)}>
                  <div className={styles.rowLeft}>
                    <div className={styles.iconBox}>{item.icon}</div>
                    <div>
                      <p className={styles.rowLabel}>{item.label}</p>
                      <p className={styles.rowSub}>{item.sub}</p>
                    </div>
                  </div>
                  <span className={`${styles.chevron} ${openIndex === i ? styles.chevronOpen : ''}`}>›</span>
                </div>
                {openIndex === i && (
                  <div className={styles.panel}>
                    {item.content({ prefs, setPrefs, darkMode, toggleDarkMode, handleUpgrade, handleAddCard, handleExportCSV })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div className={styles.rightPanel}>

            {/* Profile Card */}
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>{avatarLetter}</div>
              <div>
                <p className={styles.profileName}>{fullName}</p>
                <p className={styles.profileEmail}>{displayEmail}</p>
                <span className={styles.profileRole}>Admin</span>
              </div>
            </div>

            {/* Restaurant Name Card */}
            <div className={styles.sideCard}>
              <p className={styles.sideCardTitle}>Restaurant Profile</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0 0 0.7rem 0' }}>
                This name is shown to clients when they browse restaurants
              </p>
              <input
                type="text"
                value={restaurantName}
                onChange={e => setRestaurantName(e.target.value)}
                placeholder="Enter restaurant name"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'transparent', border: '1px solid var(--border-col)',
                  borderRadius: '0.5rem', padding: '0.6rem 0.8rem',
                  color: 'var(--text-main)', fontFamily: 'var(--body)',
                  fontSize: '0.9rem', outline: 'none', marginBottom: '0.7rem'
                }}
              />
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile || !restaurantName.trim()}
                style={{
                  width: '100%', background: 'var(--greentree)', color: '#fff',
                  border: 'none', borderRadius: '0.5rem', padding: '0.6rem',
                  fontFamily: 'var(--body)', fontSize: '0.88rem', fontWeight: 600,
                  cursor: savingProfile ? 'not-allowed' : 'pointer', opacity: savingProfile ? 0.7 : 1
                }}
              >
                {savingProfile ? 'Saving…' : 'Save Name'}
              </button>
            </div>

            {/* Plan Card */}
            <div className={styles.sideCard}>
              <p className={styles.sideCardTitle}>Current Plan</p>
              <p className={styles.planName}>Free</p>
              <p className={styles.planDesc}>1 restaurant · Basic features</p>
              <div className={styles.usageBar}>
                <div className={styles.usageFill} style={{ width: '35%' }} />
              </div>
              <p className={styles.usageLabel}>35% of storage used</p>
              <button className={styles.upgradePlanBtn} onClick={handleUpgrade}>Upgrade to Pro →</button>
            </div>

            {/* Quick Stats */}
            <div className={styles.sideCard}>
              <p className={styles.sideCardTitle}>Quick Stats</p>
              <div className={styles.quickStats}>
                <div className={styles.quickStat}>
                  <p className={styles.quickStatValue}>128</p>
                  <p className={styles.quickStatLabel}>Orders today</p>
                </div>
                <div className={styles.quickStat}>
                  <p className={styles.quickStatValue}>86</p>
                  <p className={styles.quickStatLabel}>Menu items</p>
                </div>
                <div className={styles.quickStat}>
                  <p className={styles.quickStatValue}>4</p>
                  <p className={styles.quickStatLabel}>Staff users</p>
                </div>
                <div className={styles.quickStat}>
                  <p className={styles.quickStatValue}>99%</p>
                  <p className={styles.quickStatLabel}>Uptime</p>
                </div>
              </div>
            </div>

            {/* Last Login */}
            <div className={styles.sideCard}>
              <p className={styles.sideCardTitle}>Account Activity</p>
              <div className={styles.activityRow}>
                <div className={styles.activityDot} />
                <div>
                  <p className={styles.activityText}>Last login</p>
                  <p className={styles.activitySub}>Today, 09:41 AM · Kigali</p>
                </div>
              </div>
              <div className={styles.activityRow}>
                <div className={styles.activityDot} />
                <div>
                  <p className={styles.activityText}>Password changed</p>
                  <p className={styles.activitySub}>12 days ago</p>
                </div>
              </div>
              <div className={styles.activityRow}>
                <div className={`${styles.activityDot} ${styles.dotWarning}`} />
                <div>
                  <p className={styles.activityText}>2FA not enabled</p>
                  <p className={styles.activitySub}>Enable in System settings</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default SettingsPage
