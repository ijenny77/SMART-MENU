import React, { useState, useRef, useEffect } from 'react'
import SideBar from '../../SideBar'
import search      from '../../../assets/Search1.png'
import searchLight from '../../../assets/searchLight.png'
import bell        from '../../../assets/Group 391.png'
import notifLight  from '../../../assets/notificationLight.png'
import line        from '../../../assets/line.png'
import lineLight   from '../../../assets/lineLight.png'
import user        from '../../../assets/userLight.png'
import userDark    from '../../../assets/userLight.png'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import drink1 from '../../../assets/Food/drink1.png'
import styles from './MenusPage.module.css'
import { getMenuItems, addMenuItem, deleteMenuItem } from '../../../services/menuService'
import UserMenu from '../../UserMenu'

const categories = ['Drink', 'Starter', 'Appetizer', 'Desert', 'Main']

const MenusPage = () => {
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const fullName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const lineIc   = darkMode ? line   : lineLight
  const userIc   = darkMode ? userDark : user

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [dbError, setDbError] = useState(null)

  const [activeCategory, setActiveCategory] = useState('Drink')
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const listRef = useRef(null)
  const [itemName, setItemName] = useState('')
  const [price, setPrice] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [formCategory, setFormCategory] = useState('Drink')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)

  // Fetch all menu items from Supabase on first load
  useEffect(() => {
    getMenuItems()
      .then(setItems)
      .catch(err => setDbError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setExpanded(false)
  }, [activeCategory])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    setIsOverflowing(el.scrollHeight > el.clientHeight + 2)
  }, [activeCategory, items, expanded])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result)
      setImageFile(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleAddItem = async () => {
    if (!itemName.trim() || !price.trim()) return
    setSaveLoading(true)
    try {
      const newItem = {
        category: formCategory,
        name: itemName.trim(),
        price: Number(price.trim()),
        ingredients: ingredients.trim(),
        image_url: uploadedImage || null,
        size: '—',
      }
      const saved = await addMenuItem(newItem)   // saves to Supabase
      setItems(prev => [saved, ...prev])         // add to top of list
      setActiveCategory(formCategory)
      setExpanded(false)
      setItemName('')
      setPrice('')
      setIngredients('')
      setUploadedImage(null)
      setImageFile(null)
    } catch (err) {
      alert('Failed to save item: ' + err.message)
    } finally {
      setSaveLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteMenuItem(id)
      setItems(prev => prev.filter(item => item._id !== id))
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  return (
    <div>
      <SideBar />
      <div className={styles.mainMenus}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.textMenus}>
            <p className={styles.pageTitle}>
              Operations/<span className={styles.pageTitleSub}>Menus</span>
            </p>
            <p className={styles.pageSubtitle}>Manage your restaurant in one place</p>
          </div>
          <div className={styles.rightSide}>
            <img className={styles.icons} src={searchIc} alt="" />
            <img className={styles.icons} src={bellIc} alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <UserMenu />
          </div>
        </div>

        {/* Content Card */}
        <div className={styles.contentCard}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <div className={styles.menusHeader}>
              <h2 className={styles.menusTitle}>Menus</h2>
              <div className={styles.categoryTabs}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.categoryBtn} ${activeCategory === cat ? styles.categoryActive : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <p className={styles.timestamp}>as of 25 May 2022,09:41 PM</p>

            <div
              ref={listRef}
              className={styles.menuList}
              style={{ overflow: expanded ? 'visible' : 'hidden' }}
            >
              {loading && <p style={{ padding: '1rem', opacity: 0.5 }}>Loading menu...</p>}
              {dbError && <p style={{ padding: '1rem', color: 'red' }}>Error: {dbError}</p>}
              {!loading && items.filter(item => item.category === activeCategory).length === 0 && (
                <p style={{ padding: '1rem', opacity: 0.5 }}>No items yet in this category.</p>
              )}
              {items
                .filter((item) => item.category === activeCategory)
                .map((item) => (
                  <div key={item._id} className={styles.menuItemCard}>
                    <img
                      className={styles.menuItemImage}
                      src={item.image_url || drink1}
                      alt={item.name}
                    />
                    <div className={styles.menuItemInfo}>
                      <p className={styles.itemIngredients}>{item.ingredients}</p>
                      <p className={styles.itemName}>{item.name} - {item.size}</p>
                      <p className={styles.itemPrice}>Frw {Number(item.price).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1rem' }}
                      title="Delete item"
                    >🗑</button>
                  </div>
                ))}
            </div>
            {isOverflowing && !expanded && (
              <button className={styles.moreBtn} onClick={() => setExpanded(true)}>
                More →
              </button>
            )}
          </div>

          {/* Right Section - Add Item Form */}
          <div className={styles.rightSection}>
            <div className={styles.addItemHeader}>
              <div className={styles.addItemIcon}>
                <span>&#43;</span>
              </div>
              <div>
                <p className={styles.addItemTitle}>Add Item</p>
                <p className={styles.addItemSubtitle}>Create new menu item</p>
              </div>
            </div>

            <div className={styles.uploadArea}>
              <label className={styles.uploadBox} htmlFor="imageUpload">
                {uploadedImage
                  ? <img src={uploadedImage} alt="Preview" className={styles.uploadPreview} />
                  : <span className={styles.uploadPlus}>+</span>
                }
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
              />
              <div>
                <p className={styles.uploadTitle}>Upload Image</p>
                <p className={styles.uploadSubtitle}>JPG, PNG up to  2MB</p>
              </div>
            </div>

            <div className={styles.formFields}>
              <input
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Price(FRW)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.formInput}
              />
              <input
                type="text"
                placeholder="Ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className={styles.formInput}
              />

              <div className={styles.categorySelector}>
                <p className={styles.categorySelectorTitle}>Category</p>
                <p className={styles.categorySelectorSub}>Select a category for this item</p>
                {categories.map((cat) => (
                  <label key={cat} className={styles.radioLabel}>
                    <span className={`${styles.radioCircle} ${formCategory === cat ? styles.radioChecked : ''}`}>
                      {formCategory === cat && <span className={styles.radioCheck}>✓</span>}
                    </span>
                    <span className={styles.radioText}>{cat}</span>
                    <input
                      type="radio"
                      name="formCategory"
                      value={cat}
                      checked={formCategory === cat}
                      onChange={() => setFormCategory(cat)}
                      style={{ display: 'none' }}
                    />
                  </label>
                ))}
              </div>

              <button className={styles.addButton} onClick={handleAddItem} disabled={saveLoading}>
                {saveLoading ? 'Saving...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenusPage
