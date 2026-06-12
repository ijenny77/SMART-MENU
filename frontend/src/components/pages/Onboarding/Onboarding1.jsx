import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import shop from '../../../assets/Group 88.png'
import styles from './OnboardingForm.module.css'

const STEPS = [
  { num: 1, label: 'Restaurant Info' },
  { num: 2, label: 'Type & Timings' },
  { num: 3, label: 'Create Menu' },
]

const Onboarding1 = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <p className={styles.brand}>SmartMenu</p>

        {/* Step bar */}
        <div className={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`${styles.stepItem} ${s.num === 1 ? styles.current : ''}`}>
                <div className={styles.stepNum}>{s.num === 1 ? s.num : s.num}</div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.connector}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Section header */}
        <div className={styles.sectionHeader}>
          <img src={shop} className={styles.sectionIcon} alt="" />
          <div>
            <p className={styles.sectionTitle}>Restaurant Information</p>
            <p className={styles.sectionSub}>Basic details about your restaurant and owner</p>
          </div>
        </div>

        {/* Name row */}
        <div className={styles.nameRow}>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Restaurant Name</p>
            <Input className={styles.formInput} type="text" placeholder="e.g. The Green Table" />
          </div>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Complete Name</p>
            <Input className={styles.formInput} type="text" placeholder="Full legal name" />
          </div>
        </div>

        {/* Restaurant phone */}
        <div className={styles.fieldGroup}>
          <p className={styles.fieldLabel}>Contact Number @ Restaurant</p>
          <div className={styles.phoneRow}>
            <select className={styles.countrySelect}>
              <option value="+250">🇷🇼 +250</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+254">🇰🇪 +254</option>
              <option value="+256">🇺🇬 +256</option>
            </select>
            <input type="tel" placeholder="Mobile number" className={styles.phoneInput} />
          </div>
        </div>

        {/* Owner phone */}
        <div className={styles.fieldGroup}>
          <p className={styles.fieldLabel}>Owner Contact Number</p>
          <div className={styles.phoneRow}>
            <select className={styles.countrySelect}>
              <option value="+250">🇷🇼 +250</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+254">🇰🇪 +254</option>
              <option value="+256">🇺🇬 +256</option>
            </select>
            <input type="tel" placeholder="Mobile number" className={styles.phoneInput} />
          </div>
        </div>

        {/* Owner details */}
        <div className={styles.nameRow}>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Owner Name</p>
            <Input className={styles.formInput} type="text" placeholder="Enter owner name" />
          </div>
          <div className={styles.fieldGroup}>
            <p className={styles.fieldLabel}>Owner Email</p>
            <Input className={styles.formInput} type="email" placeholder="owner@email.com" />
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.btnRow}>
          <Button className={styles.cancelBtn} onClick={() => navigate('/')}>Cancel</Button>
          <Button className={styles.continueBtn} onClick={() => navigate('/Onboarding2')}>Continue →</Button>
        </div>

      </div>
    </div>
  )
}

export default Onboarding1
