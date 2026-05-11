import React from 'react'
import logo from '../../src/assets/logo.png'
import styles from './TopBar.module.css'
import {Link} from 'react-router-dom'
import searchIcon from '../../src/assets/Search.png'
import bellIcon from '../../src/assets/Bell.png'
import User from '../../src/assets/User.png'
import Button from './ui/Button'

const TopBar = () => {
  return (
    <div className={styles.mainTopBar}>
        <div className={styles.logoName}>
            <img className={styles.logo} src={logo} alt="" />
            <p className={styles.lname}>SMART MENU</p>
        </div>
        <div className={styles.navLinks}>
            <Link className={styles.links}  to='/'>Home</Link>
            <Link className={styles.links} to='/Features'>Features</Link>
            <Link className={styles.links} to='/Pricing'>Pricing</Link>
            <Link className={styles.links} to='/Contact'>Contact</Link>
        </div>
        <div className={styles.topBarIcons}>
            <img className={styles.search} src={searchIcon} alt="search" />
            <img className={styles.bell} src={bellIcon} alt="bell" />
            <p className={styles.line}>|</p>
            <p className={styles.guest}>Miriotta</p>
            <button className={styles.user}><img className={styles.userIcon} src={User} alt="" /></button>
        </div>

    </div>
  )
}

export default TopBar