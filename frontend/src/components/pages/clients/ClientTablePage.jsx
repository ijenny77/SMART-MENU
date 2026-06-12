import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarClient from '../../SideBarClient'
import { useAuth } from '../../../context/AuthContext'
import { useClientOrder } from '../../../context/ClientOrderContext'
import steak from '../../../assets/restaurant/steak.png'
import styles from './ClientTablePage.module.css'

const STATUS = {
  available: 'available',
  occupied:  'occupied',
  reserved:  'reserved',
  selected:  'selected',
}

const LEGEND = [
  { status: STATUS.selected,  label: 'Selected'  },
  { status: STATUS.occupied,  label: 'Occupied'  },
  { status: STATUS.reserved,  label: 'Reserved'  },
  { status: STATUS.available, label: 'Available' },
]

/* Tables 4 and 9 are always reserved (pre-booked) unless overridden */
const ALWAYS_RESERVED = new Set([4, 9])
const TOTAL_TABLES    = 9

const TableUnit = ({ status, tableNum, onClick }) => (
  <div
    className={`${styles.tableUnit} ${styles[status]}`}
    onClick={onClick}
    title={`Table ${tableNum} — ${status}`}
  >
    <div className={styles.seatsTop}>
      <div className={styles.seat} /><div className={styles.seat} />
    </div>
    <div className={styles.middle}>
      <div className={styles.seatsLeft}>
        <div className={styles.seat} /><div className={styles.seat} />
      </div>
      <div className={styles.tableSquare}>
        <span className={styles.tableNum}>{tableNum}</span>
      </div>
      <div className={styles.seatsRight}>
        <div className={styles.seat} /><div className={styles.seat} />
      </div>
    </div>
    <div className={styles.seatsBottom}>
      <div className={styles.seat} /><div className={styles.seat} />
    </div>
  </div>
)

const ClientTablePage = () => {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const { restaurant, setTable } = useClientOrder()

  const fullName  = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]

  const [tables,  setTables]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const built = Array.from({ length: TOTAL_TABLES }, (_, i) => {
      const id = i + 1
      const status = ALWAYS_RESERVED.has(id) ? STATUS.reserved : STATUS.available
      return { id, status }
    })
    setTables(built)
    setLoading(false)
  }, [])

  const selectedTable = tables.find(t => t.status === STATUS.selected)

  const handleTableClick = (id) => {
    setTables(prev => prev.map(t => {
      if (t.status === STATUS.occupied || t.status === STATUS.reserved) return t
      if (t.id === id)
        return { ...t, status: t.status === STATUS.selected ? STATUS.available : STATUS.selected }
      return t.status === STATUS.selected ? { ...t, status: STATUS.available } : t
    }))
  }

  const handleConfirm = () => {
    if (!selectedTable) return
    setTable({ id: selectedTable.id, label: `Table ${selectedTable.id}` })
    navigate('/clientMenu')
  }

  const displayRestaurant = restaurant || { name: 'Selected Restaurant', description: 'Choose a table to continue.', image: null }

  return (
    <div className={styles.pageWrapper}>
      <SideBarClient />
      <div className={styles.main}>
        <img src={steak} alt="" className={styles.steakImg} />

        <p className={styles.welcome}>Welcome back &nbsp;<strong>{firstName}</strong></p>
        <h1 className={styles.heading}>Choose your Table</h1>

        {/* Restaurant card */}
        <div className={styles.restaurantCard}>
          {displayRestaurant.image && (
            <img src={displayRestaurant.image} alt={displayRestaurant.name} className={styles.restaurantImg} />
          )}
          <div className={styles.restaurantInfo}>
            <p className={styles.restaurantName}>{displayRestaurant.name}</p>
            <p className={styles.restaurantDesc}>{displayRestaurant.description}</p>
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {LEGEND.map(({ status, label }) => (
            <div key={status} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles[status]}`} />
              <span className={styles.legendLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Table grid */}
        <div className={styles.gridWrapper}>
          {loading
            ? <p style={{ color: 'var(--text-muted)', padding: '1rem' }}>Loading table availability…</p>
            : (
              <div className={styles.tableGrid}>
                {tables.map(t => (
                  <TableUnit key={t.id} tableNum={t.id} status={t.status} onClick={() => handleTableClick(t.id)} />
                ))}
              </div>
            )
          }
        </div>

        {/* Confirm */}
        <button className={styles.confirmBtn} disabled={!selectedTable || loading} onClick={handleConfirm}>
          {selectedTable ? `Confirm Table ${selectedTable.id} →` : 'Select a table to continue'}
        </button>
      </div>
    </div>
  )
}

export default ClientTablePage
