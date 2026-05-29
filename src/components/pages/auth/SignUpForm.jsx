import React from 'react'
import Input from '../../ui/Input'
import styles from './SignUpForm.module.css'
import Button from '../../ui/Button'
import Twitter from '../../../assets/Twitter.png'
import Google from '../../../assets/google-color 1.png'
import Apple from '../../../assets/apple-173 1.png'
import Facebook from '../../../assets/Group 37.png'
const SignUpForm = () => {
  return (
    <div className={styles.mainSignUpForm}>
        <p className={styles.started}>Get started</p>
        <label>Full Name</label>
        <Input type="text" placeholder="Enter Full name"/>
        <label>Email</label>
        <Input type="email" placeholder="Enter Email"/>
        <label>Password</label>
        <Input type="password" placeholder="Enter Password"/>
        <div className={styles.checkingbox}>
            <Input className={styles.checkbox} type="checkbox" placeholder=""/>
            <p className={styles.agreeTermso }>I agree to the processing of <span style={{fontWeight:"900"}}>Personal data</span></p>
        </div>
        <Button className={styles.signUp}>Sign up</Button>
        <span className={styles.divider}>Sign up with</span>
        <div className={styles.icons}>
            <a href="#"><img src={Facebook} alt="" /></a>
            <a href="#"><img src={Twitter} alt="" /></a>
            <a href="#"><img src={Google} alt="" /></a>
            <a href="#"><img src={Apple} alt="" /></a>
        </div>
        <p className={styles.haveAcc}>Already have account? <a href="#" className={styles.signIn}>Sign in</a></p>
    </div>
  )
}

export default SignUpForm