import React from 'react'
import styles from './OnboardingLeftPanel.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import stars from '../../../assets/stars 1.png'
const OnboardingLeftPanel = () => {
    const steps = [
    { num: 1, title: "Restaurant Information", desc: "Restaurant name address, Details, owner details", route: '/Onboarding1' },
    { num: 2, title: "Restaurant Type & Timings", desc: "Establishment & cuisine type, opening hours", route: '/Onboarding2' },
    { num: 3, title: "Create your menu", desc: "Menu, restaurant, food images", route: '/Onboarding3' },
    ]
    const navigate = useNavigate()
    const location = useLocation()
  return (
    <div className={styles.leftPanel}>
      <p style={{color:'var(--text-main)', marginLeft:'2.4rem', marginBottom:'1.5rem'}}>1. Create your restaurant profile</p>
      {steps.map((step) => (
        <div key={step.num} className={`${styles.step} ${location.pathname === step.route ? styles.activeStep : ""}`}>
          <div onClick={() => navigate(step.route)} className={`${styles.stepNum} ${location.pathname === step.route ? styles.activeStepNum : ''}`}>
            {step.num}
          </div>
          <div>
            <p className={styles.stepTitle}>{step.title}</p>
            <p className={styles.stepDesc}>{step.desc}</p>
          </div>
        </div>
      ))}
      <div className={styles.starsBox}>
        <img className={styles.stars} src={stars} alt="" />
        <p className={styles.textStars}>You're just a few steps away from managing your restaurant smarter!</p>
      </div>
    </div>
)
}

export default OnboardingLeftPanel