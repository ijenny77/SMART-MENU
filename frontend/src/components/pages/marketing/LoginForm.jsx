import React, { useState } from 'react'
import styles from './LoginForm.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const LoginForm = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('admin')   // UI hint
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [errMsg,       setErrMsg]       = useState('')
  const [loading,      setLoading]      = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async () => {
    if (!email || !password) { setErrMsg('Please enter email and password.'); return }
    setLoading(true)
    setErrMsg('')

    try {
      const data = await signIn({ email: email.trim(), password })
      const roleUsed = data?.user?.role || selectedRole
      navigate(roleUsed === 'client' ? '/clientRestaurants' : '/overview')
    } catch (err) {
      setErrMsg(err.message || 'Wrong email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginform}>
      <p className={styles.welcome}>Welcome</p>
      <p className={styles.loginSM}>Login to SMART MENU</p>

      {/* ── Who are you? ── */}
      <div className={styles.roleToggle}>
        <button
          type="button"
          className={`${styles.roleBtn} ${selectedRole === 'admin' ? styles.roleBtnActive : ''}`}
          onClick={() => setSelectedRole('admin')}
        >
          Restaurant Admin
        </button>
        <button
          type="button"
          className={`${styles.roleBtn} ${selectedRole === 'client' ? styles.roleBtnActive : ''}`}
          onClick={() => setSelectedRole('client')}
        >
          Customer
        </button>
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.inputLabel}>Email</span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={selectedRole === 'admin' ? 'admin@restaurant.com' : 'you@example.com'}
          className={styles.inputField}
        />
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.inputLabel}>Password</span>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••••••••••"
          className={styles.inputField}
        />
      </div>

      <div className={styles.forgotRow}>
        <p className={styles.forgotpass}>Forgot password?</p>
      </div>

      {errMsg && <p className={styles.errMsg}>{errMsg}</p>}

      <button className={styles.login} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Logging in…' : `Log in as ${selectedRole === 'client' ? 'Customer' : 'Admin'}`}
      </button>

      <span className={styles.noAcc}>
        Don't have an account?&nbsp;
        <Link to='/SignUpPage' className={styles.signup}>Sign up</Link>
      </span>
    </div>
  )
}

export default LoginForm
