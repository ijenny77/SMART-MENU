import React from 'react'
import Input from '../../ui/Input'
import styles from  './LoginForm.module.css'
import {Link} from 'react-router-dom'
import Button from '../../ui/Button'
// import email from '../../../assets/email 2.png'
// import lock from '../../../assets/lock 1.png'

const LoginForm = () => {
  return (
    <div className={styles.loginform}>
      <p className={styles.welcome}>Welcome</p>
      <p className={styles.loginSM}>Login to SMART MENU</p>
      <label style={{marginBottom:'0.7rem'}}>Email</label>
      <Input type="email" className={styles.email} />
      <label>Password</label>
      <p className={styles.forgotpass}>Forgot password?</p>
      <Input type="password" className={styles.password}/>
      <Button className={styles.login}>Log in </Button>
      <span className={styles.noAcc}>Don't have an account?<Link className={styles.signup}>Sign up?</Link></span>
    </div>
  )
}

export default LoginForm 