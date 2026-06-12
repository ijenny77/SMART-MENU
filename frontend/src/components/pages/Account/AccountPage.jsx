import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../../SideBar'
import styles from './AccountPage.module.css'
import userCamera from '../../../assets/UserCamera.png'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'
import { useTheme } from '../../../context/ThemeContext'
import search      from '../../../assets/Search1.png'
import searchLight from '../../../assets/searchLight.png'
import bell        from '../../../assets/Group 391.png'
import notifLight  from '../../../assets/notificationLight.png'
import line        from '../../../assets/line.png'
import lineLight   from '../../../assets/lineLight.png'
import UserMenu from '../../UserMenu'

const AccountPage = () => {
  const { user, signOut } = useAuth()
  const { darkMode } = useTheme()
  const navigate  = useNavigate()
  const searchIc  = darkMode ? search : searchLight
  const bellIc    = darkMode ? bell   : notifLight
  const lineIc    = darkMode ? line   : lineLight
  const firstName = (user?.name || user?.email?.split('@')[0] || 'User').split(' ')[0]

  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [avatarUrl,  setAvatarUrl]  = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const avatarInputRef = useRef(null)

  const [hoverAvatar,     setHoverAvatar]     = useState(false)
  const [saved,           setSaved]           = useState(false)
  const [saveError,       setSaveError]       = useState(null)
  const [showPassForm,    setShowPassForm]     = useState(false)
  const [currentPass,     setCurrentPass]     = useState('')
  const [newPass,         setNewPass]         = useState('')
  const [confirmPass,     setConfirmPass]     = useState('')
  const [passMsg,         setPassMsg]         = useState(null)
  const [twoFA,           setTwoFA]           = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [lang,            setLang]            = useState('en')
  const [langOpen,        setLangOpen]        = useState(false)

  const langOptions = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'rw', label: 'Kinyarwanda' },
  ]
  const langRef = useRef(null)
  useEffect(() => {
    const handler = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const handleAvatarClick = () => avatarInputRef.current?.click()

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 120
        canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        const min = Math.min(img.width, img.height)
        const sx = (img.width - min) / 2
        const sy = (img.height - min) / 2
        ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size)
        const base64 = canvas.toDataURL('image/jpeg', 0.7)
        setAvatarUrl(base64)
        setAvatarFile(base64)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaveError(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) { setPassMsg({ ok: false, text: 'Please fill in all fields.' }); return }
    if (newPass !== confirmPass) { setPassMsg({ ok: false, text: 'New passwords do not match.' }); return }
    if (newPass.length < 6) { setPassMsg({ ok: false, text: 'Password must be at least 6 characters.' }); return }
    try {
      await api.put('/users/password', { currentPassword: currentPass, newPassword: newPass })
      setPassMsg({ ok: true, text: 'Password updated successfully!' })
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
      setTimeout(() => { setPassMsg(null); setShowPassForm(false) }, 2000)
    } catch (err) {
      setPassMsg({ ok: false, text: err.message })
    }
  }

  return (
    <div>
      <SideBar />
      <div className={styles.main}>

        {/* ── Top Bar ── */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>My account</h1>
            <p className={styles.pageSubtitle}>Manage your account information and preferences</p>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.icon} src={searchIc} alt="" />
            <img className={styles.icon} src={bellIc}   alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        {/* ── Columns ── */}
        <div className={styles.columns}>

          {/* ── Left column ── */}
          <div className={styles.leftCol}>
            <div className={styles.profileInformation}>
              <div className={styles.topProfileInformation}>
                <div style={{ marginTop: '1rem' }}>
                  <p className={styles.securityTitle}>Profile information</p>
                  <p className={styles.securitySub}>Update your personal information.</p>
                </div>
                <div
                  onClick={handleAvatarClick}
                  onMouseEnter={() => setHoverAvatar(true)}
                  onMouseLeave={() => setHoverAvatar(false)}
                  style={{ position: 'relative', cursor: 'pointer', width: 'fit-content' }}
                >
                  {avatarUrl
                    ? <img src={avatarUrl} alt="avatar" style={{ width:'4.5rem',height:'4.5rem',borderRadius:'50%',objectFit:'cover',display:'block' }} />
                    : <img className={styles.imageCameraUser} src={userCamera} alt="" />
                  }
                  {hoverAvatar && (
                    <div style={{ position:'absolute',inset:0,borderRadius:'50%',background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'0.6rem',fontWeight:600,textAlign:'center',lineHeight:1.2 }}>
                      Add<br/>Profile
                    </div>
                  )}
                  <input ref={avatarInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
                </div>
              </div>

              <label className={styles.fieldLabel}>Full name</label>
              <Input className={styles.inputs} value={fullName} onChange={e => setFullName(e.target.value)} placeholder='Enter your full name' />

              <label className={styles.fieldLabel}>Email address</label>
              <Input className={styles.inputs} value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email address' />

              <label className={styles.fieldLabel}>Phone number</label>
              <Input className={styles.inputs} value={phone} onChange={e => setPhone(e.target.value)} placeholder='Enter your phone number' />

              {saved     && <p className={styles.successMsg}>✓ Changes saved successfully!</p>}
              {saveError && <p className={styles.errorMsg}>{saveError}</p>}

              <Button className={styles.saveChanges} onClick={handleSave}>Save changes</Button>
            </div>

            <div className={styles.accountActions}>
              <p className={styles.securityTitle}>Account actions</p>
              <p className={styles.securitySub}>Manage your account and data.</p>
              <div className={styles.deleteRow} onClick={() => setShowDeleteModal(true)}>
                <div className={styles.deleteIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </div>
                <div className={styles.deleteText}>
                  <p className={styles.deleteTitle}>Delete account</p>
                  <p className={styles.deleteSub}>Permanently delete your account and all data.</p>
                </div>
                <span className={styles.deleteChevron}>›</span>
              </div>
            </div>
          </div>

          {/* ── Right column ── */}
          <div className={styles.rightCol}>
            <div className={styles.accountSecurity}>
              <p className={styles.securityTitle}>Account security</p>
              <p className={styles.securitySub}>Manage your password and security settings.</p>

              <div className={styles.securityRow}>
                <span className={styles.securityLabel}>Password</span>
                <span className={styles.passwordDots}>••••••••</span>
                <button className={styles.securityBtn} onClick={() => { setShowPassForm(p => !p); setPassMsg(null) }}>
                  {showPassForm ? 'Cancel' : 'Change'} <span className={styles.arrow}>›</span>
                </button>
              </div>

              {showPassForm && (
                <div className={styles.passForm}>
                  <Input className={styles.passInput} style={{backgroundColor:'#111'}} type="password" placeholder="Current password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
                  <Input className={styles.passInput} style={{backgroundColor:'#111'}} type="password" placeholder="New password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                  <Input className={styles.passInput} style={{backgroundColor:'#111'}} type="password" placeholder="Confirm new password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                  {passMsg && <p className={passMsg.ok ? styles.successMsg : styles.errorMsg}>{passMsg.text}</p>}
                  <button className={styles.saveChanges} onClick={handleChangePassword}>Update password</button>
                </div>
              )}

              <div className={styles.securityRow}>
                <span className={styles.securityLabel}>Two-factor authentication</span>
                <span className={twoFA ? styles.enabledBadge : styles.disabledBadge}>{twoFA ? 'Enabled' : 'Disabled'}</span>
                <button className={styles.securityBtn} onClick={() => setTwoFA(p => !p)}>
                  {twoFA ? 'Disable' : 'Enable'} <span className={styles.arrow}>›</span>
                </button>
              </div>
            </div>

            <div className={styles.preferences}>
              <p className={styles.securityTitle}>Preferences</p>
              <p className={styles.securitySub}>Manage your app preferences.</p>
              <div className={styles.prefRow}>
                <span className={styles.securityLabel}>Language</span>
                <div className={styles.langDropdown} style={{ position: 'relative' }} ref={langRef}>
                  <button className={styles.langBtn} onClick={() => setLangOpen(o => !o)}>
                    {langOptions.find(o => o.value === lang)?.label}
                    <span className={`${styles.dropChevron} ${langOpen ? styles.chevronUp : ''}`}>›</span>
                  </button>
                  {langOpen && (
                    <div className={styles.langMenu}>
                      {langOptions.map(opt => (
                        <div key={opt.value} className={`${styles.langOption} ${lang === opt.value ? styles.langOptionActive : ''}`} onClick={() => { setLang(opt.value); setLangOpen(false) }}>
                          {lang === opt.value && <span className={styles.langCheck}>✓</span>}
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <p className={styles.modalTitle}>Delete account?</p>
            <p className={styles.modalSub}>This will permanently delete your account and all associated data. This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className={styles.confirmDeleteBtn} onClick={async () => { await signOut(); navigate('/') }}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountPage
