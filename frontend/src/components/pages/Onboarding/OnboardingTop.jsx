import React from 'react'
import shop from '../../../assets/Group 88.png'
import search      from '../../../assets/Search1.png'
import searchLight from '../../../assets/searchLight.png'
import bell        from '../../../assets/Group 391.png'
import notifLight  from '../../../assets/notificationLight.png'
import line        from '../../../assets/line.png'
import lineLight   from '../../../assets/lineLight.png'
import user        from '../../../assets/userLight.png'
import userDark    from '../../../assets/User.png'
import { useTheme } from '../../../context/ThemeContext'
import { useAuth } from '../../../context/AuthContext'
import styles from './OnboardingTop.module.css'
const OnboardingTop = () => {
  const { darkMode } = useTheme()
  const { user } = useAuth()
  const fullName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = fullName.split(' ')[0]
  const avatarLetter = firstName.charAt(0).toUpperCase()
  const searchIc = darkMode ? search : searchLight
  const bellIc   = darkMode ? bell   : notifLight
  const lineIc   = darkMode ? line   : lineLight
  const userIc   = darkMode ? userDark : user
  return (
    <div className={styles.mainBoardingTop}>
        <div className={styles.leftSide}>
            <img className={styles.shop} src={shop} alt="" />
            <div className={styles.text}>
                <p style={{fontWeight:'700',fontSize:'1.1rem'}}>Onboarding your restaurant</p>
                <p>Set up your business in a few simple steps</p>
            </div>
        </div>
        <div className={styles.rightSide}>
            <img className={styles.icons} src={searchIc} alt="" />
            <img className={styles.icons} src={bellIc} alt="" />
            <img className={styles.lineIcon} src={lineIc} alt="" />
            <p className={styles.username}>{firstName}</p>
            <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#3B8019', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>{avatarLetter}</div>
        </div>
    </div>
  )
}

export default OnboardingTop