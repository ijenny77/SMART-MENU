import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarClient from '../../SideBarClient'
import styles from './ClientAccountPage.module.css'
import { useAuth } from '../../../context/AuthContext'
import { api } from '../../../services/api'
import userIcon      from '../../../assets/fullName.png'
import emailIcon     from '../../../assets/emailAddress.png'
import phoneIcon     from '../../../assets/phoneNumber.png'
import addressIcon   from '../../../assets/company.png'
import dateIcon      from '../../../assets/memberSince.png'
import lockIcon      from '../../../assets/password.png'
import activeSession from '../../../assets/activeSessions.png'
import plan          from '../../../assets/currentPlan.png'
import members       from '../../../assets/member.png'
import payment       from '../../../assets/payment.png'
import security      from '../../../assets/security.png'
const FieldRow = ({ icon, label, value, editable, onChange }) => (
  <div className={styles.fieldRow}>
    <div className={styles.fieldIcon}>{icon}</div>
    <span className={styles.fieldLabel}>{label}</span>
    {editable
      ? <input className={styles.fieldInput} value={value} onChange={e => onChange(e.target.value)} />
      : <span className={styles.fieldValue}>{value || '—'}</span>
    }
    <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  </div>
)

const ClientAccountPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [company,   setCompany]   = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFile,setAvatarFile]= useState(null)
  const [hoverAvatar,setHoverAvatar] = useState(false)
  const [editing,   setEditing]   = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [showPassForm, setShowPassForm] = useState(false)
  const [currentPass,  setCurrentPass]  = useState('')
  const [newPass,      setNewPass]      = useState('')
  const [confirmPass,  setConfirmPass]  = useState('')
  const [passMsg,      setPassMsg]      = useState(null)
  const [twoFA,           setTwoFA]           = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sessionCount,    setSessionCount]    = useState(1)
  const [subscription,    setSubscription]    = useState({ plan: 'Free', billing_date: null, payment_method: null })

  const avatarRef = useRef(null)

  const firstName    = (fullName || user?.email?.split('@')[0] || 'User').split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const memberSince  = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—'

  useEffect(() => {
    if (!user) return
    setFullName(user.name || '')
    setEmail(user.email || '')
  }, [user])

  const handleToggle2FA = (val) => setTwoFA(val)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const size = 120; canvas.width = size; canvas.height = size
        const ctx = canvas.getContext('2d')
        const min = Math.min(img.width, img.height)
        ctx.drawImage(img, (img.width-min)/2, (img.height-min)/2, min, min, 0, 0, size, size)
        const b64 = canvas.toDataURL('image/jpeg', 0.7)
        setAvatarUrl(b64); setAvatarFile(b64)
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setSaveError(null)
    setAvatarFile(null); setEditing(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) { setPassMsg({ ok: false, text: 'Fill in all fields.' }); return }
    if (newPass !== confirmPass)  { setPassMsg({ ok: false, text: 'Passwords do not match.' }); return }
    if (newPass.length < 6)       { setPassMsg({ ok: false, text: 'Min 6 characters.' }); return }
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
    <div className={styles.pageWrapper}>
      <SideBarClient />

      <div className={styles.main}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <h1 className={styles.pageTitle}>Account</h1>
            <p className={styles.pageSub}>Manage your personal information and preferences</p>
          </div>
          <button className={styles.editBtn} onClick={() => editing ? handleSave() : setEditing(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {editing
                ? <polyline points="20 6 9 17 4 12"/>
                : <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>
              }
            </svg>
            {editing ? 'Save' : 'Edit profile'}
          </button>
        </div>

        {/* ── Profile Information ── */}
        <div className={styles.card}>
          <p className={styles.cardTitle}>Profile Information</p>

          <div className={styles.profileTop}>
            <div
              className={styles.avatarWrap}
              onClick={() => editing && avatarRef.current?.click()}
              onMouseEnter={() => editing && setHoverAvatar(true)}
              onMouseLeave={() => setHoverAvatar(false)}
              style={{ cursor: editing ? 'pointer' : 'default' }}
            >
              {avatarUrl
                ? <img src={avatarUrl} alt="" className={styles.avatarImg} />
                : <div className={styles.avatarFallback}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
              }
              {hoverAvatar && editing && <div className={styles.avatarOverlay}>Change</div>}
              <input ref={avatarRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
            </div>
            <div>
              <p className={styles.profileName}>{fullName || 'Your Name'}</p>
              <p className={styles.profileEmail}>{email}</p>
              <span className={styles.roleBadge}>Client</span>
            </div>
          </div>

          <div className={styles.fieldList}>
            <FieldRow icon={<img src={userIcon}    alt="" className={styles.fieldIconImg} />} label="Full Name"    value={fullName}    editable={editing} onChange={setFullName} />
            <FieldRow icon={<img src={emailIcon}   alt="" className={styles.fieldIconImg} />} label="Email Address" value={email}      editable={false} />
            <FieldRow icon={<img src={phoneIcon}   alt="" className={styles.fieldIconImg} />} label="Phone Number" value={phone}       editable={editing} onChange={setPhone} />
            <FieldRow icon={<img src={addressIcon} alt="" className={styles.fieldIconImg} />} label="Company"      value={company}     editable={editing} onChange={setCompany} />
            <FieldRow icon={<img src={dateIcon}    alt="" className={styles.fieldIconImg} />} label="Member Since" value={memberSince} editable={false} />
          </div>

          {saved     && <p className={styles.successMsg}>✓ Changes saved!</p>}
          {saveError && <p className={styles.errorMsg}>{saveError}</p>}
        </div>

        {/* ── Security ── */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <div>
              <p className={styles.cardTitle}>Security</p>
              <p className={styles.cardSub}>Keep your account secure</p>
            </div>
            <button className={styles.outlineBtn} onClick={() => { setShowPassForm(p => !p); setPassMsg(null) }}>
              Change Password
            </button>
          </div>

          {showPassForm && (
            <div className={styles.passForm}>
              <input className={styles.passInput} type="password" placeholder="Current password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
              <input className={styles.passInput} type="password" placeholder="New password"     value={newPass}     onChange={e => setNewPass(e.target.value)} />
              <input className={styles.passInput} type="password" placeholder="Confirm password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
              {passMsg && <p className={passMsg.ok ? styles.successMsg : styles.errorMsg}>{passMsg.text}</p>}
              <button className={styles.greenBtn} onClick={handleChangePassword}>Update password</button>
            </div>
          )}

          <div className={styles.fieldList}>
            <FieldRow icon={<img src={lockIcon} alt="" className={styles.fieldIconImg} />} label="Password" value="••••••••••••••••" editable={false} />
            <div className={styles.fieldRow} onClick={() => handleToggle2FA(!twoFA)}>
              <div className={styles.fieldIcon}>
                <img src={security} alt="" className={styles.fieldIconImg} />
              </div>
              <span className={styles.fieldLabel}>Two-Factor Authentication</span>
              <span className={`${styles.fieldValue} ${twoFA ? styles.enabledText : styles.mutedText}`}>{twoFA ? 'Enabled' : 'Not enabled'}</span>
              <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <FieldRow icon={<img src={activeSession} alt="" className={styles.fieldIconImg} />} label="Active Sessions" value={`${sessionCount} active session${sessionCount !== 1 ? 's' : ''}`} editable={false} />
          </div>
        </div>

        {/* ── Subscription ── */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <div>
              <p className={styles.cardTitle}>Subscription</p>
              <p className={styles.cardSub}>Manage your plan and billing</p>
            </div>
            <button className={styles.outlineBtn} onClick={() => navigate('/clientSettings', { state: { tab: 'billing' } })}>
              View Billing
            </button>
          </div>
          <div className={styles.fieldList}>
            <div className={styles.fieldRow}>
              <div className={styles.fieldIcon}>
                <img src={plan} alt="" className={styles.fieldIconImg} />
              </div>
              <span className={styles.fieldLabel}>Current Plan</span>
              <span className={styles.fieldValue}>
                {subscription.plan} &nbsp;<span className={styles.activeBadge}>ACTIVE</span>
              </span>
              <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
            <FieldRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              label="Member Since"
              value={memberSince}
              editable={false}
            />
            <FieldRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
              label="Payment Method"
              value={subscription.payment_method || 'Not set'}
              editable={false}
            />
          </div>
        </div>

        {/* ── Delete Account ── */}
        <div className={`${styles.card} ${styles.dangerCard}`} onClick={() => setShowDeleteModal(true)}>
          <div className={styles.dangerRow}>
            <div className={styles.dangerIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div>
              <p className={styles.dangerTitle}>Delete Account</p>
              <p className={styles.dangerSub}>Permanently delete your account and all data</p>
            </div>
            <svg style={{ marginLeft:'auto', color:'#e05252' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <p className={styles.modalTitle}>Delete account?</p>
            <p className={styles.modalText}>This action is permanent and cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={async () => { await signOut(); navigate('/') }}>Yes, delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientAccountPage
