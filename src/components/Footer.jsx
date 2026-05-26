import React from 'react'
import logo from '../assets/logo.png'
import styles from './Footer.module.css'
const Footer = () => {
  return (
    <div className={styles.mainFooter}>
      <hr className={styles.hrLine}/>
      <div className={styles.footer}>
        <img className={styles.logo} src={logo} alt="" />
        <p className={styles.smartMenu}>SMART MENU</p>
        <p>&2026;2024 Smart Menu.All rights reserved.</p>
        <p>Privacy Policy</p>
        <p>Terms of Service</p>
        <p>Support</p>
      </div>
    </div>
  )
}

export default Footer