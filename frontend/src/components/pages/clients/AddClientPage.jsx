import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBar from '../../SideBar'
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
import { addClient } from '../../../services/clientService'
import storeIcon from '../../../assets/fork-and-knife-meal 1.png'
import styles from './AddClientPage.module.css'
import UserMenu from '../../UserMenu'
import house from '../../../assets/house.png'
import phone from '../../../assets/phone.png'
import representative from '../../../assets/representative.png'
import email from '../../../assets/email.png'
import DateCreation from '../../../assets/DateCreation.png'
import ClientName from '../../../assets/ClientName.png'
import category from '../../../assets/category.png'
import bank from '../../../assets/Bank.png'
import address from '../../../assets/address.png'
const AddClientPage = () => {
  const navigate = useNavigate()
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const fullName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const lineIc   = darkMode ? line   : lineLight
  const userIc   = darkMode ? userDark : user
  const [form, setForm] = useState({
    clientName: '',
    category: '',
    representative: '',
    dateOfCreation: '',
    address: '',
    email: '',
    phone: '',
    iban: '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if (!form.clientName.trim() || !form.category) {
      setSaveError('Client name and category are required.')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await addClient({
        name:             form.clientName.trim(),
        category:         form.category,
        representative:   form.representative.trim(),
        date_of_creation: form.dateOfCreation || null,
        address:          form.address.trim(),
        email:            form.email.trim(),
        phone:            form.phone.trim(),
        iban:             form.iban.trim(),
        sales:            0,
      })
      navigate('/ClientsListPage')
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SideBar />
      <div className={styles.main}>

        {/* Top Bar */}
        <div className={styles.topBar}>
          <p className={styles.breadcrumb}>
            <span className={styles.breadcrumbLink} onClick={() => navigate('/ClientsListPage')}>
              Clients
            </span>
            <span className={styles.breadcrumbSep}> / Add New Client</span>
          </p>
          <div className={styles.rightSide}>
            <img className={styles.icon} src={searchIc} alt="" />
            <img className={styles.icon} src={bellIc} alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerCircle}>
            <img src={house} alt="" className={styles.storeIcon} />
          </div>
          <div>
            <p className={styles.headerTitle}>Add New Client</p>
            <p className={styles.headerSub}>Fill in the details to add a new client</p>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formGrid}>

          {/* Left Column */}
          <div className={styles.formColumn}>
            <div className={styles.fieldGroup}>
              <img src={ClientName} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Client Name</label>
                <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Enter client name" className={styles.fieldInput} />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <img src={category} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} className={`${styles.fieldInput} ${styles.fieldSelect}`}>
                  <option value="" disabled>Choose category</option>
                  <option value="RESTO">RESTO</option>
                  <option value="HOTEL">HOTEL</option>
                  <option value="CAFE">CAFE</option>
                  <option value="BAR">BAR</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <img src={representative} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Representative</label>
                <input name="representative" value={form.representative} onChange={handleChange} placeholder="Enter representative name" className={styles.fieldInput} />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <img src={DateCreation} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Date of Creation</label>
                <input type="date" name="dateOfCreation" value={form.dateOfCreation} onChange={handleChange} className={styles.fieldInput} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.formColumn}>
            <div className={styles.fieldGroup}>
              <img src={address} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Enter address" className={styles.fieldInput} />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <img src={email} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email address" className={styles.fieldInput} />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <img src={phone} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter phone number" className={styles.fieldInput} />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <img src={bank} alt="" className={styles.fieldIconImg} />
              <div className={styles.fieldContent}>
                <label className={styles.fieldLabel}>Bank Account(IBAN)</label>
                <input name="iban" value={form.iban} onChange={handleChange} placeholder="Enter IBAN" className={styles.fieldInput} />
              </div>
            </div>
          </div>

        </div>

        {/* Submit */}
        <div className={styles.submitRow}>
          {saveError && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{saveError}</p>}
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : '+ Add Client'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddClientPage
