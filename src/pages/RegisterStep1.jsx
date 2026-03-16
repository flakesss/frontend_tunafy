import React, { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GoogleLoginButton from '../components/GoogleLoginButton'
import logoTunafyBiru from '../assets/images/logo icon tunafy (biru).png'
import logoTunafyPutih from '../assets/images/logo icon tunafy (putih).png'
import fotoTuna from '../assets/images/foto tuna.png'
import eyeOpen from '../assets/images/eye-open.svg'
import eyeClose from '../assets/images/eye-close.svg'
import { Agentation } from 'agentation'
import { authApi } from '../api/authApi'
import './RegisterPage.css'

// Debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

// Password strength checker
const checkPasswordStrength = (password, t) => {
  let score = 0
  const missing = []

  if (password.length >= 8) {
    score += 2
  } else if (password.length >= 6) {
    score += 1
    missing.push(t('register.passwordStrength.minChars'))
  } else {
    missing.push(t('register.passwordStrength.minChars'))
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1
  } else {
    missing.push(t('register.passwordStrength.upperLower'))
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    missing.push(t('register.passwordStrength.number'))
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  } else {
    missing.push(t('register.passwordStrength.symbol'))
  }

  return { score, missing }
}

const getPasswordStrengthLabel = (score, t) => {
  if (score <= 1) return { label: t('register.passwordStrength.weak'), color: '#EF4444', width: '20%' }
  if (score === 2) return { label: t('register.passwordStrength.fair'), color: '#F59E0B', width: '40%' }
  if (score === 3) return { label: t('register.passwordStrength.medium'), color: '#F59E0B', width: '60%' }
  if (score === 4) return { label: t('register.passwordStrength.strong'), color: '#10B981', width: '80%' }
  return { label: t('register.passwordStrength.veryStrong'), color: '#10B981', width: '100%' }
}

const isPasswordStrong = (password, t) => checkPasswordStrength(password || '', t).score >= 3

// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ password, t }) => {
  const { score, missing } = checkPasswordStrength(password || '', t)
  const { label, color, width } = getPasswordStrengthLabel(score, t)

  return (
    <div 
      className="password-strength-wrapper"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        marginTop: '0.25rem',
        visibility: password ? 'visible' : 'hidden',
        opacity: password ? 1 : 0,
        transition: 'opacity 0.2s ease, visibility 0.2s ease'
      }}
    >
      <div className="password-strength" style={{ marginTop: 0, visibility: 'visible', opacity: 1 }}>
        <div className="password-strength-bar">
          <div 
            className="password-strength-fill" 
            style={{ width: password ? width : '0%', backgroundColor: color }}
          />
        </div>
        <span className="password-strength-label" style={{ color }}>
          {label || '\u00A0'}
        </span>
      </div>
      <div 
        className="password-requirements" 
        style={{ 
          fontSize: '0.75rem', 
          color: '#6B7280',
          minHeight: '2.25rem',
          lineHeight: '1.25'
        }}
      >
        {password && missing.length > 0 ? (
          <span style={{ color: '#EF4444' }}>{t('register.passwordStrength.missing')} {missing.join(', ')}</span>
        ) : password && missing.length === 0 ? (
          <span style={{ color: '#10B981' }}>{t('register.passwordStrength.perfect')}</span>
        ) : (
          '\u00A0'
        )}
      </div>
    </div>
  )
}

export default function RegisterStep1() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    username: '',
    password: ''
  })

  // Availability states
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' })

  const navigate = useNavigate()

  // Debounced values for API calls
  const debouncedUsername = useDebounce(formData.username, 500)

  // Check availability menggunakan real API backend
  const checkAvailability = useCallback(async (type, value) => {
    if (!value) return { available: null, message: '' }
    try {
      let response
      if (type === 'username') {
        response = await authApi.checkUsername(value)
      }
      const result = response?.data?.data || {}
      return { available: result.available, message: result.message || '' }
    } catch (err) {
      return { available: null, message: '' }
    }
  }, [])

  // Check username availability
  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      setUsernameStatus({ checking: true, available: null, message: '' })
      checkAvailability('username', debouncedUsername).then(result => {
        setUsernameStatus({ checking: false, ...result })
      })
    } else if (debouncedUsername) {
      setUsernameStatus({ checking: false, available: false, message: t('register.usernameMin') })
    } else {
      setUsernameStatus({ checking: false, available: null, message: '' })
    }
  }, [debouncedUsername, checkAvailability])

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email.trim()) {
      setError(t('register.errors.emailRequired'))
      return
    }
    if (usernameStatus.available === false) {
      setError(t('register.errors.fixErrors'))
      return
    }

    setLoading(true)
    setError('')

    try {
      await authApi.register({
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        username: formData.username.trim(),
      })

      setShowSuccess(true)

      setTimeout(() => {
        navigate('/login')
      }, 3000)

    } catch (err) {
      const msg = err.response?.data?.message || err.message || t('register.errors.failed')
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.email && formData.full_name && formData.username && formData.password && isPasswordStrong(formData.password, t) && agreedToTerms

  // Success Notification
  if (showSuccess) {
    return (
      <div className="register-page">
        {import.meta.env.DEV && <Agentation />}
        <div className="register-container">
          <div className="register-grid">
            {/* Left Panel - Blue Gradient */}
            <div 
              className="register-branding"
              style={{
                background: `
                  radial-gradient(circle at 10% 10%, #0066FF 0%, transparent 40%),
                  radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
                  linear-gradient(135deg, #001233 0%, #000814 100%)
                `
              }}
            >
              {/* Background Image */}
              <div className="register-branding-background">
                <img src={fotoTuna} alt="Nelayan" />
              </div>

              {/* Logo Icon - Top Left */}
              <div className="register-branding-logo">
                <img src={logoTunafyPutih} alt="Tunafy" />
              </div>

              {/* Gradient Overlay */}
              <div 
                className="register-branding-overlay"
                style={{
                  background: 'linear-gradient(0deg, rgba(0, 83, 173, 0.5) 77.27%, rgba(0, 34, 71, 0) 100%)'
                }}
              />

              {/* Branding text */}
              <div className="register-branding-text">
                <h2>{t('register.brandingTitle')}</h2>
                <p>{t('register.brandingDesc')}</p>
              </div>
            </div>

            {/* Right Panel - Success Message */}
            <div className="register-form-container">
              <div className="register-form-wrapper">
                {/* Success Icon */}
                <div className="register-success-icon">
                  <div className="success-icon-circle success-icon-green">
                    <svg className="success-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                {/* Success Heading */}
                <h1 className="register-heading register-heading-center">
                  {t('register.successTitle')}
                </h1>
                <p className="register-subheading register-subheading-center">
                  {t('register.successDesc')}
                </p>

                {/* Redirect Button */}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="register-submit-btn"
                >
                  {t('register.successBtn')}
                </button>

                <p className="register-redirect-text">
                  {t('register.successRedirect')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="register-page">
      {import.meta.env.DEV && <Agentation />}
      <div className="register-container">
        <div className="register-grid">
          {/* Left Panel - Blue Gradient (Hidden on mobile) */}
          <div 
            className="register-branding"
            style={{
              background: `
                radial-gradient(circle at 10% 10%, #0066FF 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
                linear-gradient(135deg, #001233 0%, #000814 100%)
              `
            }}
          >
            {/* Background Image */}
            <div className="register-branding-background">
              <img src={fotoTuna} alt="Nelayan" />
            </div>

            {/* Logo Icon - Top Left */}
            <div className="register-branding-logo">
              <img src={logoTunafyPutih} alt="Tunafy" />
            </div>

            {/* Gradient Overlay */}
            <div 
              className="register-branding-overlay"
              style={{
                background: 'linear-gradient(0deg, rgba(0, 83, 173, 0.5) 77.27%, rgba(0, 34, 71, 0) 100%)'
              }}
            />

            {/* Branding text - Bottom, Above Overlay */}
            <div className="register-branding-text">
              <h2>{t('register.brandingTitle')}</h2>
              <p>{t('register.brandingDesc')}</p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="register-form-container">
            <div className="register-form-wrapper">
              {/* Logo */}
              <div className="register-logo">
                <img src={logoTunafyBiru} alt="Tunafy" />
              </div>

              {/* Heading */}
              <h1 className="register-heading">
                {t('register.heading')}
              </h1>
              <p className="register-subheading">
                {t('register.subheading')}
              </p>

              {/* Error Message */}
              {error && (
                <div className="register-error">
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="register-form" onSubmit={onSubmit}>
                {/* Email */}
                <div className="register-field">
                  <label className="register-label">
                    {t('register.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder={t('register.emailPlaceholder')}
                    className="register-input"
                    required
                  />
                </div>

                {/* Full name */}
                <div className="register-field">
                  <label className="register-label">
                    {t('register.name')}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={onChange}
                    placeholder={t('register.namePlaceholder')}
                    className="register-input"
                    required
                  />
                </div>

                {/* Username */}
                <div className="register-field">
                  <label className="register-label">
                    {t('register.username')}
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    placeholder={t('register.usernamePlaceholder')}
                    className={`register-input ${
                      usernameStatus.available === true ? 'input-success' :
                      usernameStatus.available === false ? 'input-error' : ''
                    }`}
                    pattern="[a-zA-Z0-9_.]{3,20}"
                    title={t('register.usernameHint')}
                    required
                  />
                  <p 
                    className={`field-message ${usernameStatus.available === true ? 'text-success' : usernameStatus.available === false ? 'text-error' : ''}`}
                    style={{ visibility: (usernameStatus.message || usernameStatus.checking) ? 'visible' : 'hidden' }}
                  >
                    {usernameStatus.checking ? t('register.usernameChecking') : usernameStatus.message || '\u00A0'}
                  </p>
                </div>

                {/* Password */}
                <div className="register-field">
                  <label className="register-label">
                    {t('register.password')}
                  </label>
                  <div className="register-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      placeholder={t('register.passwordPlaceholder')}
                      className="register-input"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="register-password-toggle"
                    >
                      <img src={showPassword ? eyeOpen : eyeClose} alt="" />
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator password={formData.password} t={t} />
                </div>

                {/* Terms Checkbox */}
                <div className="register-terms">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="register-checkbox"
                  />
                  <label htmlFor="agree-terms" className="register-terms-label">
                    {t('register.terms')}{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="register-link-inline"
                    >
                      {t('register.termsLink')}
                    </button>
                    {' '}{t('register.and')}{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/privacy')}
                      className="register-link-inline"
                    >
                      {t('register.privacyLink')}
                    </button>
                    {' '}{t('register.termsOf')}
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className={`register-submit-btn ${!isFormValid ? 'btn-disabled' : ''} ${loading ? 'btn-loading' : ''}`}
                >
                  {loading ? (
                    <div className="loading-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : (
                    t('register.submit')
                  )}
                </button>

                {/* Divider */}
                <div className="register-divider">
                  <span>{t('register.orDivider')}</span>
                </div>

                {/* Google Sign Up */}
                <GoogleLoginButton mode="register" />

                {/* Sign In Link */}
                <div className="register-signin">
                  <p>
                    {t('register.hasAccount')}{' '}
                    <Link to="/login" className="register-link">
                      {t('register.loginLink')}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
