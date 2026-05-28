import React from 'react'
import TopBar from '../../TopBar'
import homeImage from '../../../assets/HomeImage.png'
import styles from './HomePage.module.css'
import Button from '../../ui/Button'
import User from '../../../assets/Group 389.png'
import Bag from '../../../assets/Group 47.png'
import Users from '../../../assets/Group 23.png'
import StatsSection from './StatsSection'
import Working from './Working'
import LoginPage from './LoginPage'
import Footer from '../../Footer'
const HomePage = () => {
  return (
    <div className={styles.mainHomePage}>
        <TopBar/>
        <div className={styles.HomePage}>
          <div className={styles.HomePageLeft}>
            
            <div className={styles.authButtons}>
              <Button className={styles.authButton}><img src={User} alt="user" />Register your restaurant</Button>
              <Button className={styles.authButton}><img src={Bag} alt="Bag" /> Restaurant already registered?</Button>
            </div>
            <img className={styles.landingImage} src={homeImage} alt="landing Image" />
          </div>
          <div className={styles.HomePageRight}>
            <p className={styles.allInOne}>All-in-one Restaurant Menu Management </p>
            <h3 className={styles.LandingText}>SMART MENU FOR MODERN <span className={styles.restaurants}> RESTAURANTS.</span></h3>
            <p className={styles.landingTextSmall}>create digital menus,update items instantly, and receive orders in real time.</p>
            <p className={styles.landingTextSmall}>No paper menus. No confusion. Just smart management</p>
            <div className={styles.Users}>
              <img src={Users} alt="" />
              <p className={styles.usersText}>Join 500+ restaurants <br /> growing with <span className={styles.smartMenu}>SMART MENU</span></p>
            </div>
          </div>
          <div className={styles.homeLast}>
            <StatsSection/>
            <Working/>
            <LoginPage/>
          </div>
        </div>
        <Footer/>
    </div>
  )
}

export default HomePage