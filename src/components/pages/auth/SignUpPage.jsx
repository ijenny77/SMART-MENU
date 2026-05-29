import React from 'react'
import styles from './SignUpPage.module.css'
import SignUpForm from './SignUpForm'
import coffeeCombo from '../../../assets/coffeeCombo.png'
import time from '../../../assets/Group 116.png'
import tracks from '../../../assets/Group 118.png'
import chairs from '../../../assets/Group 121.png'
const SignUpPage = () => {
  return (
    <div className={styles.mainSignUpPage}>
      <div className={styles.textSide}>
        <p className={styles.welcomeSmartMenu}>Welcome to <span style={{color:"#CEFBE0"}}>SMART MENU</span></p>
        <p className={styles.manageRestaurant}>Manage your restaurant smarter faster</p>
        <div className={styles.card1}>
          <img className={styles.icons} src={chairs} alt="" />
          <div>
            <p className={styles.headings}>Easy Menu Management</p>
            <p className={styles.paragraph}>Create and update menus in just a few clicks.</p>
          </div>
        </div>
        <div className={styles.card2}>
          <img className={styles.icons} src={tracks} alt="" />
          <div>
            <p className={styles.headings}>Track Performance</p>
            <p className={styles.paragraph}>Great real-time insights and grow your business.</p>
          </div>
        </div>
        <div className={styles.card3}>
          <img className={styles.icons} src={time} alt="" />
          <div>
            <p className={styles.headings}>Save Time</p>
            <p className={styles.paragraph}>Automate tasks and focus on what matters most.</p>
          </div>
        </div>
      </div>
      <img className={styles.coffeeCombo} src={coffeeCombo} alt="" />
      <SignUpForm/>
    </div>
  )
}

export default SignUpPage