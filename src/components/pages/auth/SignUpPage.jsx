import React from 'react'
import styles from './SignUpPage.module.css'
import SignUpForm from './SignUPForm'
const SignUpPage = () => {
  return (
    <div className={styles.mainSignUpPage}>
      <SignUpForm/>
    </div>
  )
}

export default SignUpPage