import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import clock from '../../../assets/clock 1.png'
import earth from '../../../assets/earth 1.png'
import set   from '../../../assets/fork-and-knife-meal 1.png'
import styles from './OnboardingForm.module.css'

const STEPS = [
  { num: 1, label: 'Restaurant Info' },
  { num: 2, label: 'Type & Timings' },
  { num: 3, label: 'Create Menu' },
]

const Onboarding2 = () => {
  const [restaurantType, setRestaurantType] = useState('Restaurant')
  const [cuisine,        setCuisine]        = useState('African')
  const [fromTime,       setFromTime]       = useState('08:00')
  const [toTime,         setToTime]         = useState('22:00')
  const [images,         setImages]         = useState([])
  const navigate = useNavigate()

  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <p className={styles.brand}>SmartMenu</p>

        {/* Step bar */}
        <div className={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`${styles.stepItem} ${s.num < 2 ? styles.done : s.num === 2 ? styles.current : ''}`}>
                <div className={styles.stepNum}>{s.num < 2 ? '✓' : s.num}</div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.connector} ${i === 0 ? styles.connectorDone : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Section header */}
        <div className={styles.sectionHeader}>
          <img src={clock} className={styles.sectionIcon} alt="" />
          <div>
            <p className={styles.sectionTitle}>Restaurant Type & Timings</p>
            <p className={styles.sectionSub}>Tell us about your restaurant and when you're open</p>
          </div>
        </div>

        {/* Restaurant type */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Restaurant Type</label>
          <div className={styles.selectWrapper}>
            <img src={set} alt="" />
            <select value={restaurantType} onChange={e => setRestaurantType(e.target.value)}>
              <option>Restaurant</option>
              <option>Pub</option>
              <option>Hotel</option>
              <option>Coffeeshop</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Cuisine */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Cuisine Type</label>
          <div className={styles.selectWrapper}>
            <img src={earth} alt="" />
            <select value={cuisine} onChange={e => setCuisine(e.target.value)}>
              <option>African</option>
              <option>Asian</option>
              <option>European</option>
              <option>American</option>
              <option>Mediterranean</option>
            </select>
          </div>
        </div>

        {/* Opening hours */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Opening Hours</label>
          <div className={styles.timeRow}>
            <div className={styles.timeBox}>
              <span className={styles.timeLabel}>From</span>
              <select className={styles.timeSelect} value={fromTime} onChange={e => setFromTime(e.target.value)}>
                {hours.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className={styles.timeBox}>
              <span className={styles.timeLabel}>To</span>
              <select className={styles.timeSelect} value={toTime} onChange={e => setToTime(e.target.value)}>
                {hours.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Upload Images (pictures or logo)</label>
          <label className={styles.uploadBox}>
            <Input
              type="file"
              multiple
              accept="image/*"
              hidden
              onChange={e => setImages([...e.target.files])}
            />
            {images.length > 0 ? `${images.length} image(s) selected` : '+ Choose Images'}
          </label>
        </div>

        <hr className={styles.divider} />

        <div className={styles.btnRow}>
          <Button className={styles.cancelBtn} onClick={() => navigate('/onboarding')}>Back</Button>
          <Button className={styles.continueBtn} onClick={() => navigate('/Onboarding3')}>Continue →</Button>
        </div>

      </div>
    </div>
  )
}

export default Onboarding2
