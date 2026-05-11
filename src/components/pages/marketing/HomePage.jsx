import React from 'react'
import TopBar from '../../TopBar'
import homeImage from '../../../assets/HomeImage.png'
import styles from './HomePage.module.css'
import Button from '../../ui/Button'
import User from '../../../assets/Group 389.png'
import Bag from '../../../assets/Group 47.png'
const HomePage = () => {
  return (
    <div className={styles.mainHomePage}>
        <TopBar/>
        <div className={styles.HomePage}>
          <div className={styles.HomePageLeft}>
            <img className={styles.landingImage} src={homeImage} alt="landing Image" />
            <div className={styles.authButtons}>
              <Button className={styles.authButton}><img src={User} alt="user" />Register your restaurant</Button>
              <Button className={styles.authButton}><img src={Bag} alt="Bag" /> Restaurant already registered?</Button>
            </div>
          </div>
          <div className={styles.HomePageRight}>
            <p className={styles.allInOne}>All-in-one Restaurant Menu Management </p>
            <h3 className={styles.}>SMART MENU FOR MODERN RESTAURANTS.</h3>
            <p>create digital menus,update items instantly, and receive orders in real time.</p>
            <p>No paper menus. No confusion. Just smart management</p>
          </div>
        </div>
    </div>
  )
}

export default HomePage