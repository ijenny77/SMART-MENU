import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../ui/Button'
import { addMenuItem } from '../../../services/menuService'
import styles from './OnboardingForm.module.css'

const STEPS = [
  { num: 1, label: 'Restaurant Info' },
  { num: 2, label: 'Type & Timings' },
  { num: 3, label: 'Create Menu' },
]

const CATEGORIES = ['Drink', 'Starter', 'Appetizer', 'Dessert', 'Main']

const Onboarding3 = () => {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState('Drink')
  const [items, setItems]                   = useState([{ name: '', price: '', description: '', category: 'Drink' }])
  const [saving, setSaving]                 = useState(false)
  const [error, setError]                   = useState('')

  const updateItem = (idx, field, value) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const addRow = () => {
    setItems(prev => [...prev, { name: '', price: '', description: '', category: activeCategory }])
  }

  const handleFinish = async () => {
    const valid = items.filter(i => i.name.trim() && i.price)
    if (valid.length === 0) {
      navigate('/overview')
      return
    }
    setSaving(true)
    setError('')
    try {
      await Promise.all(
        valid.map(i => addMenuItem({
          name:        i.name.trim(),
          price:       Number(i.price),
          description: i.description.trim(),
          category:    i.category,
        }))
      )
      navigate('/overview')
    } catch (err) {
      setError('Failed to save menu items: ' + err.message)
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <p className={styles.brand}>SmartMenu</p>

        {/* Step bar */}
        <div className={styles.stepBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.num}>
              <div className={`${styles.stepItem} ${s.num < 3 ? styles.done : styles.current}`}>
                <div className={styles.stepNum}>{s.num < 3 ? '✓' : s.num}</div>
                <span className={styles.stepLabel}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.connector} ${styles.connectorDone}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Section header */}
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionTitle}>Create your Menu</p>
            <p className={styles.sectionSub}>Add your first menu items — you can add more later from the dashboard</p>
          </div>
        </div>

        {/* Category pills */}
        <div className={styles.categoryRow}>
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              className={`${styles.categoryBtn} ${activeCategory === cat ? styles.activeCategoryBtn : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Menu item rows */}
        <div className={styles.formSection}>
          {items.map((item, idx) => (
            <div key={idx} className={styles.itemBlock}>
              {items.length > 1 && (
                <p className={styles.itemIndex}>Item {idx + 1}</p>
              )}
              <div className={styles.nameRow}>
                <div className={styles.menuItem}>
                  <label className={styles.fieldLabel}>Name</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    placeholder="e.g. Grilled Chicken"
                    value={item.name}
                    onChange={e => updateItem(idx, 'name', e.target.value)}
                  />
                </div>
                <div className={styles.menuItem}>
                  <label className={styles.fieldLabel}>Price (RWF)</label>
                  <input
                    className={styles.formInput}
                    type="number"
                    placeholder="e.g. 5000"
                    value={item.price}
                    onChange={e => updateItem(idx, 'price', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.menuItem}>
                <label className={styles.fieldLabel}>Description</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Ingredients, details..."
                  value={item.description}
                  onChange={e => updateItem(idx, 'description', e.target.value)}
                />
              </div>
              <div className={styles.menuItem}>
                <label className={styles.fieldLabel}>Category</label>
                <select
                  className={styles.formInput}
                  value={item.category}
                  onChange={e => updateItem(idx, 'category', e.target.value)}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>

        {error && <p style={{ color: '#e05252', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

        <hr className={styles.divider} />

        <div className={styles.btnRow}>
          <Button className={styles.addMoreBtn} onClick={addRow}>+ Add Another Item</Button>
          <Button className={styles.cancelBtn} onClick={() => navigate('/Onboarding2')}>Back</Button>
          <Button className={styles.continueBtn} onClick={handleFinish} disabled={saving}>
            {saving ? 'Saving…' : 'Finish →'}
          </Button>
        </div>

      </div>
    </div>
  )
}

export default Onboarding3
