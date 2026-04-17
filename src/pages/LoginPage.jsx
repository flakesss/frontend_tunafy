import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/axios'
import { useTranslation } from 'react-i18next'
import GoogleLoginButton from '../components/GoogleLoginButton'
import logoTunafyBiru from '../assets/images/logo icon tunafy (biru).png'
import logoTunafyPutih from '../assets/images/logo icon tunafy (putih).png'
import nelayanBawaTuna from '../assets/images/nelayan bawa tuna.png'
import eyeOpen from '../assets/images/eye-open.svg'
import eyeClose from '../assets/images/eye-close.svg'
import { Agentation } from 'agentation'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, forceClear, isAuthenticated, loading: authLoading } = useAuth()
  const { t } = useTranslation()
  
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect jika sudah login
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/marketplace')
    }
  }, [authLoading, isAuthenticated, navigate])

  // Auto-clear: Bersihkan data lama saat masuk halaman login
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if ((token && !user) || (!token && user)) {
      console.log('Detected incomplete auth data, clearing...')
      forceClear()
    }
  }, [forceClear])

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError(t('login.errors.required'))
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await authAPI.login(email.trim(), password)
      
      // Backend wraps response dalam ApiResponse: { success, data: { user, session } }
      const payload = response.data?.data || response.data
      const userData = payload.user
      const sessionToken = payload.session?.access_token

      if (!sessionToken) {
        throw new Error('Token tidak diterima dari server')
      }

      // Login ke context — simpan user & token ke localStorage
      login(userData, sessionToken)
      
      // Redirect ke marketplace
      navigate('/marketplace')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || err.message || t('login.errors.failed'))
    } finally {
      setLoading(false)
    }
  }

  // Tampilkan loading saat auth masih checking
  if (authLoading) {
    return (
      <div className="login-page">
        <div className="login-loading">
          <div className="login-loading-spinner"></div>
          <p>Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      {import.meta.env.DEV && <Agentation />}
      <div className="login-container">
        <div className="login-grid">
          {/* Left Panel - Blue Gradient (Hidden on mobile) */}
          <div 
            className="login-branding"
            style={{
              background: `
                radial-gradient(circle at 10% 10%, #0066FF 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
                linear-gradient(135deg, #001233 0%, #000814 100%)
              `
            }}
          >
            {/* Background Image */}
            <div className="login-branding-background">
              <img src={nelayanBawaTuna} alt="Nelayan" />
            </div>

            {/* Logo Icon - Top Left */}
            <div className="login-branding-logo">
              <img src={logoTunafyPutih} alt="Flocify" />
            </div>

            {/* Gradient Overlay -50% Transparent */}
            <div
              className="login-branding-overlay"
              style={{
                background: 'linear-gradient(0deg, rgba(0, 83, 173, 0.5) 77.27%, rgba(0, 34, 71, 0) 100%)'
              }}
            />

            {/* Branding text - Bottom, Above Overlay */}
            <div className="login-branding-text">
              <h2>{t('login.brandingTitle')}</h2>
              <p>
                {t('login.brandingDesc')}
              </p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="login-form-container">
            <div className="login-form-wrapper">
              {/* Logo */}
              <div className="login-logo">
                <img src={logoTunafyBiru} alt="Flocify" />
              </div>

              {/* Heading */}
              <h1 className="login-heading">
                {t('login.heading')}
              </h1>
              <p className="login-subheading">
                {t('login.subheading')}
              </p>

              {/* Form */}
              <form className="login-form" onSubmit={handleLogin}>
                {error && (
                  <div className="login-error">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="login-field">
                  <label className="login-label">
                    {t('login.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login.emailPlaceholder')}
                    className="login-input"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="login-field">
                  <label className="login-label">
                    {t('login.password')}
                  </label>
                  <div className="login-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      className="login-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="login-password-toggle"
                    >
                      <img src={showPassword ? eyeOpen : eyeClose} alt="" />
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="login-submit-btn"
                >
                  {loading ? (
                    <div className="loading-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    t('login.submit')
                  )}
                </button>

                {/* Divider */}
                <div className="login-divider">
                  <span>{t('login.orDivider')}</span>
                </div>

                {/* Google Login */}
                <GoogleLoginButton mode="login" />

                {/* Forgot Password Link */}
                <div className="login-forgot-password">
                  <Link to="/forgot-password">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="login-signup">
                <p>
                  {t('login.noAccount')}{' '}
                  <Link to="/register">
                    {t('login.register')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
