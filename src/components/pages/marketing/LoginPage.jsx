import React from 'react'
import LoginForm from './LoginForm'
import styles from './LoginPage.module.css'
import clipboard from '../../../assets/Group 52.png'
import busdelivery from '../../../assets/Group 50.png'
import lamp from '../../../assets/Group 53.png'
import apple from '../../../assets/Group 46.png'

const items = [
  {
    icon:clipboard,
    heading:'Digital Menu Management ',
    paragraph:'Create, update and organize your menu items in just a few clicks.'
  },
  {
    icon:busdelivery,
    heading:'Real-time Orders ',
    paragraph:'Receive and manage customer orders in real time.'
  },
  {
    icon:lamp,
    heading:'Smart Insights ',
    paragraph:'Track performance and understand your business better.'
  }
]
const LoginPage = () => {
  return (
      <div className={styles.mainLoginPage}>
        <div className={styles.info}>
          <p className={styles.quote}>EASY . FAST . SMART</p>
          <p className={styles.text}>Manage Your Restaurant <br/> Like Never Before </p>
          <div className={styles.leftside}>
            <div>
              {items.map((item) => (
                <div className={styles.boxes}>
                  <img src={item.icon} alt="" />
                  <div className={styles.grpText}>
                    <p className={styles.heading}>{item.heading}</p>
                    <p className={styles.paragraph}>{item.paragraph}</p>
                  </div>
                </div>
                ))}
            </div>
            <img className={styles.apple} src={apple} alt="" />
          </div>
        </div>
        <LoginForm/>
      </div>
  )
}

export default LoginPage