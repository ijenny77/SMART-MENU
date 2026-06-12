import React, { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import styles from './SignUpForm.module.css'
import Twitter  from '../../../assets/Twitter.png'
import Google   from '../../../assets/google-color 1.png'
import Apple    from '../../../assets/apple-173 1.png'
import Facebook from '../../../assets/Group 37.png'

const SignUpForm = () => {
  const [name,           setName]           = useState('')
  const [restaurantName, setRestaurantName] = useState('')
  const [email,          setEmail]          = useState('')
  const [password,       setPassword]       = useState('')
  const [role,           setRole]           = useState('admin')
  const [agreed,         setAgreed]         = useState(false)
  const [errMsg,         setErrMsg]         = useState('')
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setErrMsg('Email and password are required'); return }
    if (password.length < 6) { setErrMsg('Password must be at least 6 characters'); return }
    if (role === 'admin' && !restaurantName.trim()) { setErrMsg('Restaurant name is required'); return }

    try {
      await signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() || restaurantName.trim(), role, restaurantName: restaurantName.trim() } },
      })
      navigate(role === 'admin' ? '/onboarding' : '/clientRestaurants')
    } catch (err) {
      setErrMsg(err.message)
    }
  }

  return (
    <div className={styles.mainSignUpForm}>
      <p className={styles.started}>Get started</p>

      {/* ── Role toggle ── */}
      <div className={styles.roleToggle}>
        <button
          type="button"
          className={`${styles.roleBtn} ${role === 'admin' ? styles.roleBtnActive : ''}`}
          onClick={() => setRole('admin')}
        >
          Restaurant Admin
        </button>
        <button
          type="button"
          className={`${styles.roleBtn} ${role === 'client' ? styles.roleBtnActive : ''}`}
          onClick={() => setRole('client')}
        >
          Customer
        </button>
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.inputLabel}>Full Name</span>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter Full Name"
          className={styles.inputField}
        />
      </div>

      {role === 'admin' && (
        <div className={styles.inputGroup}>
          <span className={styles.inputLabel}>Restaurant Name</span>
          <input
            type="text"
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            placeholder="Enter Restaurant Name"
            className={styles.inputField}
          />
        </div>
      )}

      <div className={styles.inputGroup}>
        <span className={styles.inputLabel}>Email</span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter Email"
          className={styles.inputField}
        />
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.inputLabel}>Password</span>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter Password"
          className={styles.inputField}
        />
      </div>

      <div className={styles.checkingbox}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className={styles.checkbox}
        />
        <p className={styles.agreeTerms}>
          I agree to the processing of <strong>Personal data</strong>
        </p>
      </div>

      {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

      <button onClick={handleSubmit} className={styles.signUp}>Sign up</button>

      <span className={styles.divider}>Sign up with</span>

      <div className={styles.icons}>
        <a href="#"><img src={Facebook} alt="Facebook" /></a>
        <a href="#"><img src={Twitter}  alt="Twitter"  /></a>
        <a href="#"><img src={Google}   alt="Google"   /></a>
        <a href="#"><img src={Apple}    alt="Apple"    /></a>
      </div>

      <p className={styles.haveAcc}>
        Already have account?&nbsp;<Link to='/login' className={styles.signIn}>Sign in</Link>
      </p>
    </div>
  )
}

export default SignUpForm
