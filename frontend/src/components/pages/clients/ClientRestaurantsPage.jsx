import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarClient from '../../SideBarClient'
import { useAuth } from '../../../context/AuthContext'
import { useClientOrder } from '../../../context/ClientOrderContext'
import { getRestaurants } from '../../../services/restaurantService'
import steak    from '../../../assets/restaurant/steak.png'
import menuIcon from '../../../assets/restaurant/menu.png'
import bagIcon  from '../../../assets/restaurant/bag.png'
import r1 from '../../../assets/restaurant/A fine dining experience in a Michelin-starred… 2.png'
import r2 from '../../../assets/restaurant/Elegant Fine Dining_ A beautifully set dining… 1.png'
import r3 from '../../../assets/restaurant/Interior Design - Ho Lee Fook 2022 - Central SOHO, Hong Kong by dix design+architecture — Design Anthology 2.png'
import r4 from '../../../assets/restaurant/RIWAQDESIGNS  Warm wood tones, ambient lighting… 2.png'
import r5 from '../../../assets/restaurant/download (1) 2.png'
import r6 from '../../../assets/restaurant/download 1.png'
import styles from './ClientRestaurantsPage.module.css'

const FALLBACK_IMAGES = [r1, r2, r3, r4, r5, r6]
const fallback = (index) => FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]

const ClientRestaurantsPage = () => {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const { setRestaurant } = useClientOrder()
  const fullName  = authUser?.name || authUser?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]

  const [restaurants, setRestaurants] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selectedId,  setSelectedId]  = useState(null)

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch(() => [])
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <SideBarClient />
        <div className={styles.main}><p style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading restaurants…</p></div>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <SideBarClient />

      <div className={styles.main}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <p className={styles.welcome}>Welcome back &nbsp;<strong>{firstName}</strong></p>
            <h1 className={styles.heading}>Manage Update<br />Grow Seamlessly.</h1>
            <p className={styles.subtitle}>Everything you need to run your restaurants smarter and faster.</p>
          </div>
          <img src={steak} alt="" className={styles.headerImg} />
        </div>

        <div className={styles.chooseDivider}>
          <span className={styles.arrow}>→</span>
          <span className={styles.chooseText}>Choose a restaurant</span>
          <span className={styles.arrow}>←</span>
        </div>

        {restaurants.length === 0
          ? <p style={{ color: 'var(--text-muted)' }}>No restaurants available yet.</p>
          : (
            <div className={styles.list}>
              {restaurants.map((r, idx) => (
                <div
                  key={r._id}
                  className={`${styles.card} ${selectedId === r._id ? styles.cardSelected : ''}`}
                  onClick={() => setSelectedId(r._id)}
                >
                  <img
                    src={fallback(idx)}
                    alt={r.name}
                    className={styles.cardImg}
                  />

                  <div className={styles.cardBody}>
                    <p className={styles.cardName}>{r.restaurantName || r.name}</p>
                    <p className={styles.cardDesc}>{r.email}</p>

                    <div className={styles.stats}>
                      <div className={styles.statItem}>
                        <img src={bagIcon} alt="" className={styles.statIcon} />
                        <div className={styles.statText}>
                          <span className={styles.statVal}>—</span>
                          <span className={styles.statLabel}>Total Orders</span>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <img src={menuIcon} alt="" className={styles.statIcon} />
                        <div className={styles.statText}>
                          <span className={styles.statVal}>—</span>
                          <span className={styles.statLabel}>Menu Items</span>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <img src={bagIcon} alt="" className={styles.statIcon} />
                        <div className={styles.statText}>
                          <span className={styles.statVal}>—</span>
                          <span className={styles.statLabel}>Orders Today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    className={styles.arrowBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      setRestaurant({ id: r._id, name: r.restaurantName || r.name, image: fallback(idx), description: '' })
                      navigate('/clientTable')
                    }}
                  >
                    →
                  </button>
                </div>
              ))}
            </div>
          )
        }

      </div>
    </div>
  )
}

export default ClientRestaurantsPage
