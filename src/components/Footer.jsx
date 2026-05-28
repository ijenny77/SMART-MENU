import React from 'react'
import logo from '../assets/logo.png'
import styles from './Footer.module.css'
const Footer = () => {
  return (
    <div className={styles.mainFooter}>
      <hr className={styles.hrLine}/>
      <div className={styles.footer}>
        <div className={styles.leftSection}>
          <img className={styles.logo} src={logo} alt="" />
          <p className={styles.smartMenu}>SMART MENU</p>
        </div>
        <p className={styles.copyright}>{'\u00A9'} 2026 Smart Menu. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/support">Support</a>
        </div>
      </div>
    </div>
  )
}

export default Footer