import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'
import SideBarClient from '../../SideBarClient'
import styles from './ClientSettingsPage.module.css'

/* ── Asset imports ── */
import settingsIc      from '../../../assets/settings-2 2.png'
import alertsIc        from '../../../assets/Icon.png'
import lockIc          from '../../../assets/lock 2.png'
import billingIc          from '../../../assets/Frame.png'
import paletteIc         from '../../../assets/paint-palette-art 1.png'
import earthIc         from '../../../assets/earth 2.png'
import checkIc         from '../../../assets/_x32_.png'
import emailIc         from '../../../assets/emailNot.png'
import clockIc         from '../../../assets/reminder.png'
import bellIc          from '../../../assets/pushNot.png'
import onlineIc       from '../../../assets/online.png'
import revenueIc       from '../../../assets/dataSharing.png'
import deleteIc        from '../../../assets/delete.png'
import securityIc      from '../../../assets/Frame (1).png'
import updatesIc       from '../../../assets/updates.png'

/* ── Toggle switch ── */
const Toggle = ({ value, onChange }) => (
  <div className={`${styles.toggle} ${value ? styles.toggleOn : ''}`} onClick={() => onChange(!value)}>
    <div className={styles.toggleThumb} />
  </div>
)

/* ── Select row ── */
const SelectRow = ({ label, value, onChange, options }) => (
  <div className={styles.selectRow}>
    <span className={styles.selectLabel}>{label}</span>
    <select className={styles.selectInput} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

/* ── Toggle row with PNG icon ── */
const ToggleRow = ({ icon, label, sub, value, onChange }) => (
  <div className={styles.toggleRow}>
    <div className={styles.toggleIcon}>
      <img src={icon} alt="" className={styles.toggleIconImg} />
    </div>
    <div className={styles.toggleText}>
      <p className={styles.toggleLabel}>{label}</p>
      <p className={styles.toggleSub}>{sub}</p>
    </div>
    <Toggle value={value} onChange={onChange} />
  </div>
)

/* ── Left nav tabs with PNG icons ── */
const NAV_TABS = [
  { key: 'general',       label: 'General',       icon: settingsIc  },
  { key: 'notifications', label: 'Notifications', icon: alertsIc    },
  { key: 'security',      label: 'Security',       icon: securityIc      },
  { key: 'billing',       label: 'Billing',        icon: billingIc      },
  { key: 'appearance',    label: 'Appearance',     icon: paletteIc     },
  { key: 'language',      label: 'Language',       icon: earthIc     },
  { key: 'integrations',  label: 'Integrations',   icon: checkIc     },
  { key: 'privacy',       label: 'Data & Privacy', icon: lockIc      },
]

const ClientSettingsPage = () => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { darkMode, toggleDarkMode } = useTheme()
  const { user } = useAuth()

  const [activeTab,  setActiveTab]  = useState(location.state?.tab || 'general')
  const [saved,      setSaved]      = useState(false)
  const [saving,     setSaving]     = useState(false)

  const [timezone,   setTimezone]   = useState('CAT')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [currency,   setCurrency]   = useState('RWF')
  const [itemsPage,  setItemsPage]  = useState('25')
  const [startWeek,  setStartWeek]  = useState('Monday')

  const [emailNotif,   setEmailNotif]   = useState(true)
  const [pushNotif,    setPushNotif]    = useState(true)
  const [taskReminder, setTaskReminder] = useState(true)
  const [marketing,    setMarketing]    = useState(false)

  const [profileVisibility, setProfileVisibility] = useState('only_me')
  const [onlineStatus,   setOnlineStatus]   = useState(true)
  const [dataSharing,    setDataSharing]    = useState(false)
  const [deleteInactive, setDeleteInactive] = useState(false)

  /* ── Security tab state ── */
  const [showPassForm,  setShowPassForm]  = useState(false)
  const [newPass,       setNewPass]       = useState('')
  const [confirmPass,   setConfirmPass]   = useState('')
  const [passMsg,       setPassMsg]       = useState(null)
  const [twoFA,         setTwoFA]         = useState(false)

  /* ── Language tab state ── */
  const [language, setLanguage] = useState('en')

  /* ── Billing tab state ── */
  const [subscription, setSubscription] = useState({ plan: 'Free', billing_date: null, payment_method: null })

  useEffect(() => {
    if (!user) return
    const p = {}
    if (p.timezone)           setTimezone(p.timezone)
    if (p.dateFormat)         setDateFormat(p.dateFormat)
    if (p.currency)           setCurrency(p.currency)
    if (p.itemsPage)          setItemsPage(p.itemsPage)
    if (p.startWeek)          setStartWeek(p.startWeek)
    if (p.emailNotif   != null) setEmailNotif(p.emailNotif)
    if (p.pushNotif    != null) setPushNotif(p.pushNotif)
    if (p.taskReminder != null) setTaskReminder(p.taskReminder)
    if (p.marketing    != null) setMarketing(p.marketing)
    if (p.profileVisibility)    setProfileVisibility(p.profileVisibility)
    if (p.onlineStatus  != null) setOnlineStatus(p.onlineStatus)
    if (p.dataSharing   != null) setDataSharing(p.dataSharing)
    if (p.deleteInactive != null) setDeleteInactive(p.deleteInactive)
    if (p.language)             setLanguage(p.language)

    /* Load security + subscription */
    setTwoFA(false)
  }, [user])

  /* ── Security handlers ── */
  const handleChangePassword = async () => {
    if (!newPass || !confirmPass) { setPassMsg({ ok: false, text: 'Fill in both fields.' }); return }
    if (newPass !== confirmPass)  { setPassMsg({ ok: false, text: 'Passwords do not match.' }); return }
    if (newPass.length < 6)       { setPassMsg({ ok: false, text: 'Minimum 6 characters.' }); return }
    try {
      await api.put('/users/password', { currentPassword: currentPass || '', newPassword: newPass })
      setPassMsg({ ok: true, text: 'Password updated successfully!' })
      setNewPass(''); setConfirmPass('')
      setTimeout(() => { setPassMsg(null); setShowPassForm(false) }, 2000)
    } catch (err) {
      setPassMsg({ ok: false, text: err.message })
    }
  }

  const handleToggle2FA = (val) => setTwoFA(val)

  const handleSave = async () => {
    setSaving(true)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className={styles.pageWrapper}>
      <SideBarClient />

      <div className={styles.main}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <h1 className={styles.pageTitle}>Settings</h1>
            <p className={styles.pageSub}>Manage your preferences and application settings</p>
          </div>
        </div>

        {/* ── Two-panel ── */}
        <div className={styles.panels}>

          {/* ── Left nav ── */}
          <nav className={styles.navPanel}>
            {NAV_TABS.map(tab => (
              <button
                key={tab.key}
                className={`${styles.navItem} ${activeTab === tab.key ? styles.navItemActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <img src={tab.icon} alt="" className={styles.navIcon} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ── Right content ── */}
          <div className={styles.contentPanel}>

            {/* General */}
            {activeTab === 'general' && (
              <>
                <div className={styles.section}>
                  <p className={styles.sectionTitle}>General Preferences</p>
                  <p className={styles.sectionSub}>Configure general application settings</p>
                  <div className={styles.selectList}>
                    <SelectRow label="Time Zone"        value={timezone}   onChange={setTimezone}   options={[{ value:'CAT', label:'(GMT+2) Kigali (CAT)' },{ value:'EST', label:'(GMT-5) Eastern Time' },{ value:'UTC', label:'UTC' }]} />
                    <SelectRow label="Date Format"      value={dateFormat} onChange={setDateFormat} options={[{ value:'DD/MM/YYYY', label:'DD/MM/YYYY' },{ value:'MM/DD/YYYY', label:'MM/DD/YYYY' },{ value:'YYYY-MM-DD', label:'YYYY-MM-DD' }]} />
                    <SelectRow label="Default Currency" value={currency}   onChange={setCurrency}   options={[{ value:'RWF', label:'RWF (Frw)' },{ value:'USD', label:'USD ($)' },{ value:'EUR', label:'EUR (€)' }]} />
                    <SelectRow label="Items Per Page"   value={itemsPage}  onChange={setItemsPage}  options={[{ value:'10', label:'10' },{ value:'25', label:'25' },{ value:'50', label:'50' }]} />
                    <SelectRow label="Start Week On"    value={startWeek}  onChange={setStartWeek}  options={[{ value:'Monday', label:'Monday' },{ value:'Sunday', label:'Sunday' }]} />
                  </div>
                </div>

                <div className={styles.section}>
                  <p className={styles.sectionTitle}>Notifications</p>
                  <p className={styles.sectionSub}>Choose how you want to be notified</p>
                  <div className={styles.toggleList}>
                    <ToggleRow icon={emailIc}   label="Email Notifications" sub="Receive updates via email"         value={emailNotif}   onChange={setEmailNotif}   />
                    <ToggleRow icon={bellIc}    label="Push Notifications"  sub="Receive push notifications"       value={pushNotif}    onChange={setPushNotif}    />
                    <ToggleRow icon={clockIc}   label="Task Reminders"      sub="Get reminded about due tasks"     value={taskReminder} onChange={setTaskReminder} />
                    <ToggleRow icon={updatesIc}  label="Marketing Updates"   sub="Receive product updates and tips" value={marketing}    onChange={setMarketing}    />
                  </div>
                </div>

                <div className={styles.section}>
                  <p className={styles.sectionTitle}>Privacy Settings</p>
                  <p className={styles.sectionSub}>Manage your privacy and data preferences</p>
                  <SelectRow label="Profile Visibility" value={profileVisibility} onChange={setProfileVisibility} options={[{ value:'only_me', label:'Only me' },{ value:'everyone', label:'Everyone' },{ value:'connections', label:'Connections only' }]} />
                  <div className={styles.toggleList} style={{ marginTop: '1rem' }}>
                    <ToggleRow icon={onlineIc} label="Show Online Status"       sub="Allow others to see when you're online"          value={onlineStatus}   onChange={setOnlineStatus}   />
                    <ToggleRow icon={revenueIc} label="Data Sharing"             sub="Allow anonymous analytics"                       value={dataSharing}    onChange={setDataSharing}    />
                    <ToggleRow icon={deleteIc}  label="Delete Inactive Account"  sub="Auto-delete account after 2 years of inactivity" value={deleteInactive} onChange={setDeleteInactive} />
                  </div>
                </div>

                <button className={styles.saveBtn} onClick={handleSave}>
                  {saved ? '✓ Changes Saved' : 'Save Changes'}
                </button>
              </>
            )}

            {/* Notifications tab */}
            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Notification Preferences</p>
                <p className={styles.sectionSub}>Control which notifications you receive</p>
                <div className={styles.toggleList}>
                  <ToggleRow icon={emailIc}  label="Email Notifications" sub="Receive updates via email"         value={emailNotif}   onChange={setEmailNotif}   />
                  <ToggleRow icon={bellIc}   label="Push Notifications"  sub="Receive push notifications"       value={pushNotif}    onChange={setPushNotif}    />
                  <ToggleRow icon={clockIc}  label="Task Reminders"      sub="Get reminded about due tasks"     value={taskReminder} onChange={setTaskReminder} />
                  <ToggleRow icon={alertsIc} label="Marketing Updates"   sub="Receive product updates and tips" value={marketing}    onChange={setMarketing}    />
                </div>
                <button className={styles.saveBtn} onClick={handleSave} style={{ marginTop: '1.5rem' }}>
                  {saved ? '✓ Saved' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Appearance tab */}
            {activeTab === 'appearance' && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Appearance</p>
                <p className={styles.sectionSub}>Customize how Smart Menu looks for you</p>
                <div className={styles.toggleList}>
                  <ToggleRow icon={starsIc} label="Dark Mode" sub="Switch between dark and light theme" value={darkMode} onChange={toggleDarkMode} />
                </div>
              </div>
            )}

            {/* Security tab */}
            {activeTab === 'security' && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Security</p>
                <p className={styles.sectionSub}>Keep your account safe and secure</p>

                <div className={styles.toggleList} style={{ marginBottom: '1.2rem' }}>
                  <div className={styles.toggleRow}>
                    <div className={styles.toggleIcon}><img src={lockIc} alt="" className={styles.toggleIconImg} /></div>
                    <div className={styles.toggleText}>
                      <p className={styles.toggleLabel}>Two-Factor Authentication</p>
                      <p className={styles.toggleSub}>Require a second step when signing in</p>
                    </div>
                    <Toggle value={twoFA} onChange={handleToggle2FA} />
                  </div>
                </div>

                <div style={{ marginBottom: '0.8rem' }}>
                  <button
                    className={styles.saveBtn}
                    style={{ width: 'auto', marginBottom: '0.8rem' }}
                    onClick={() => { setShowPassForm(p => !p); setPassMsg(null) }}
                  >
                    {showPassForm ? 'Cancel' : 'Change Password'}
                  </button>
                  {showPassForm && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.8rem' }}>
                      <input
                        className={styles.selectInput}
                        type="password"
                        placeholder="New password"
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                      />
                      <input
                        className={styles.selectInput}
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                      />
                      {passMsg && (
                        <p style={{ fontSize: '0.8rem', color: passMsg.ok ? '#4ade80' : '#f87171' }}>{passMsg.text}</p>
                      )}
                      <button className={styles.saveBtn} style={{ width: 'auto' }} onClick={handleChangePassword}>
                        Update Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Language tab */}
            {activeTab === 'language' && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Language & Region</p>
                <p className={styles.sectionSub}>Set your preferred language and regional format</p>
                <div className={styles.selectList}>
                  <SelectRow
                    label="Language"
                    value={language}
                    onChange={setLanguage}
                    options={[
                      { value: 'en',    label: 'English' },
                      { value: 'fr',    label: 'Français' },
                      { value: 'rw',    label: 'Kinyarwanda' },
                      { value: 'sw',    label: 'Swahili' },
                    ]}
                  />
                  <SelectRow label="Date Format"      value={dateFormat} onChange={setDateFormat} options={[{ value:'DD/MM/YYYY', label:'DD/MM/YYYY' },{ value:'MM/DD/YYYY', label:'MM/DD/YYYY' },{ value:'YYYY-MM-DD', label:'YYYY-MM-DD' }]} />
                  <SelectRow label="Time Zone"        value={timezone}   onChange={setTimezone}   options={[{ value:'CAT', label:'(GMT+2) Kigali (CAT)' },{ value:'EST', label:'(GMT-5) Eastern Time' },{ value:'UTC', label:'UTC' }]} />
                  <SelectRow label="Default Currency" value={currency}   onChange={setCurrency}   options={[{ value:'RWF', label:'RWF (Frw)' },{ value:'USD', label:'USD ($)' },{ value:'EUR', label:'EUR (€)' }]} />
                </div>
                <button className={styles.saveBtn} onClick={handleSave} style={{ marginTop: '1.2rem' }}>
                  {saved ? '✓ Saved' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Billing tab */}
            {activeTab === 'billing' && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Billing & Subscription</p>
                <p className={styles.sectionSub}>Manage your plan and payment details</p>

                <div className={styles.selectList} style={{ marginBottom: '1.2rem' }}>
                  <div className={styles.selectRow}>
                    <span className={styles.selectLabel}>Current Plan</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {subscription.plan}
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', background: 'var(--accent)', color: '#fff', borderRadius: '4px', padding: '1px 6px' }}>ACTIVE</span>
                    </span>
                  </div>
                  <div className={styles.selectRow}>
                    <span className={styles.selectLabel}>Payment Method</span>
                    <span style={{ color: 'var(--text-muted)' }}>{subscription.payment_method || 'Not configured'}</span>
                  </div>
                  {subscription.billing_date && (
                    <div className={styles.selectRow}>
                      <span className={styles.selectLabel}>Next Billing Date</span>
                      <span style={{ color: 'var(--text-muted)' }}>{subscription.billing_date}</span>
                    </div>
                  )}
                </div>

                {subscription.plan === 'Free' && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.3rem', color: 'var(--text-main)' }}>Upgrade to Pro</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                      Unlock unlimited orders, priority support, and analytics.
                    </p>
                    <button className={styles.saveBtn} style={{ width: 'auto' }} onClick={() => alert('Contact support to upgrade your plan.')}>
                      Upgrade Plan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Privacy tab */}
            {activeTab === 'privacy' && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>Data &amp; Privacy</p>
                <p className={styles.sectionSub}>Manage your privacy and data preferences</p>
                <SelectRow label="Profile Visibility" value={profileVisibility} onChange={setProfileVisibility} options={[{ value:'only_me', label:'Only me' },{ value:'everyone', label:'Everyone' },{ value:'connections', label:'Connections only' }]} />
                <div className={styles.toggleList} style={{ marginTop: '1rem' }}>
                  <ToggleRow icon={onlineIc} label="Show Online Status"       sub="Allow others to see when you're online"          value={onlineStatus}   onChange={setOnlineStatus}   />
                  <ToggleRow icon={revenueIc} label="Data Sharing"             sub="Allow anonymous analytics"                       value={dataSharing}    onChange={setDataSharing}    />
                  <ToggleRow icon={deleteIc}  label="Delete Inactive Account"  sub="Auto-delete account after 2 years of inactivity" value={deleteInactive} onChange={setDeleteInactive} />
                </div>
                <button className={styles.saveBtn} onClick={handleSave} style={{ marginTop: '1.5rem' }}>
                  {saved ? '✓ Saved' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Integrations + coming soon for any remaining tabs */}
            {!['general', 'notifications', 'appearance', 'security', 'language', 'billing', 'privacy'].includes(activeTab) && (
              <div className={styles.section}>
                <p className={styles.sectionTitle}>{NAV_TABS.find(t => t.key === activeTab)?.label}</p>
                <p className={styles.sectionSub}>This section is coming soon.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientSettingsPage
