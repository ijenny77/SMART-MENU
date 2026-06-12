import React, { useState, useEffect } from 'react'
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
import plusSquare from '../../../assets/Plus square.png'
import styles from './ClientsListPage.module.css'
import UserMenu from '../../UserMenu'
import { getClients } from '../../../services/clientService'

const formatUpdated = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr)
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Updated today'
  if (days === 1) return 'Updated 1 day ago'
  return `Updated ${days} days ago`
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `on ${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`
}

const ClientsListPage = () => {
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

  const [clients, setClients]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [dbError, setDbError]         = useState(null)
  const [sortAsc, setSortAsc]         = useState(true)
  const [filterCategory, setFilterCategory] = useState('All')
  const [viewClient, setViewClient]   = useState(null)

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(err => setDbError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const displayed = [...clients]
    .filter(c => filterCategory === 'All' || c.category === filterCategory)
    .sort((a, b) => sortAsc
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
    )

  return (
    <div>
      <SideBar />
      <div className={styles.main}>

        {/* Top Bar */}
        <div className={styles.topBar}>
          <div>
            <p className={styles.pageTitle}>Client</p>
            <p className={styles.pageSubtitle}>Welcome back, <strong>{firstName}</strong> 👋</p>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.icon} src={searchIc} alt="" />
            <img className={styles.icon} src={bellIc} alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        {/* New Client Card */}
        <div className={styles.newClientCard} onClick={() => navigate('/AddClientPage')} style={{ cursor: 'pointer' }}>
          <div className={styles.newClientLeft}>
            <div className={styles.newClientCircle}>
              <img src={plusSquare} alt="" className={styles.plusSquareImg} />
            </div>
            <div>
              <p className={styles.newClientTitle}>New Client</p>
              <p className={styles.newClientSub}>Add a new client to get started</p>
            </div>
          </div>
          <button className={styles.addBtn} onClick={(e) => { e.stopPropagation(); navigate('/AddClientPage') }}>+</button>
        </div>

        {/* All Clients Card */}
        <div className={styles.allClientsCard}>
          <div className={styles.allClientsHeader}>
            <p className={styles.allClientsTitle}>All Clients</p>
            <div className={styles.tableActions}>
              <button className={styles.actionBtn} onClick={() => setSortAsc(p => !p)}>
                ⇅ sort
              </button>
              <button
                className={styles.actionBtn}
                onClick={() => setFilterCategory(f => f === 'All' ? 'RESTO' : f === 'RESTO' ? 'HOTEL' : 'All')}
              >
                ⊽ Filter
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className={styles.tableHeader}>
            <span className={styles.colDetails}>Clients details</span>
            <span className={styles.colSales}>Sales</span>
            <span className={styles.colReport}>Detailed report</span>
            <span className={styles.colCategory}>Category</span>
          </div>

          {/* Client Rows */}
          <div className={styles.tableBody}>
            {loading && <p style={{ padding: '1rem', opacity: 0.5 }}>Loading clients...</p>}
            {dbError && <p style={{ padding: '1rem', color: 'red' }}>Error: {dbError}</p>}
            {!loading && !dbError && displayed.length === 0 && (
              <p style={{ padding: '1rem', opacity: 0.5 }}>No clients yet. Add one to get started.</p>
            )}
            {displayed.map(c => (
              <div key={c.id} className={styles.clientRow}>
                <div className={styles.colDetails}>
                  <p className={styles.clientName}>{c.name}</p>
                  <p className={styles.clientUpdated}>{formatUpdated(c.updated_at || c.created_at)}</p>
                </div>
                <div className={styles.colSales}>
                  <p className={styles.salesAmount}>{c.sales ? `${Number(c.sales).toLocaleString()} Frw` : '—'}</p>
                  <p className={styles.salesDate}>{formatDate(c.date_of_creation || c.created_at)}</p>
                </div>
                <div className={styles.colReport}>
                  <span className={styles.eyeIcon} style={{ cursor: 'pointer' }} onClick={() => setViewClient(c)}>👁</span>
                </div>
                <div className={styles.colCategory}>
                  <span className={styles.categoryBadge}>{c.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      {viewClient && (
        <div onClick={() => setViewClient(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border-col)',
            borderRadius: '1.2rem', padding: '2rem', minWidth: '22rem',
            fontFamily: 'var(--body)', display: 'flex', flexDirection: 'column', gap: '0.7rem'
          }}>
            <p style={{ fontFamily: 'var(--headings)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {viewClient.name}
            </p>
            {[
              ['Category',    viewClient.category],
              ['Total Sales', viewClient.sales ? `${Number(viewClient.sales).toLocaleString()} Frw` : '—'],
              ['Created',     formatDate(viewClient.date_of_creation || viewClient.created_at)],
              ['Status',      formatUpdated(viewClient.updated_at || viewClient.created_at)],
              ['Email',       viewClient.email || '—'],
              ['Phone',       viewClient.phone || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-col2)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <button onClick={() => setViewClient(null)} style={{
              marginTop: '0.5rem', background: 'var(--green)', border: 'none',
              borderRadius: '0.6rem', padding: '0.65rem 1.2rem', fontFamily: 'var(--buttons)',
              fontWeight: 700, cursor: 'pointer', color: 'var(--black)', alignSelf: 'flex-end'
            }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientsListPage
