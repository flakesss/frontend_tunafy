import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createClient } from '@supabase/supabase-js'
import logoTunafyBiru from '../assets/images/logo icon tunafy (biru).png'
import logoTunafyPutih from '../assets/images/logo icon tunafy (putih).png'
import nelayanBawaTuna from '../assets/images/nelayan bawa tuna.png'
import eyeOpen from '../assets/images/eye-open.svg'
import eyeClose from '../assets/images/eye-close.svg'
import './ResetPasswordPage.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState(null) // null=checking, true=ok, false=invalid

  useEffect(() => {
    // Supabase mengirim token di URL hash: #access_token=...&type=recovery
    const hash = window.location.hash
    const params = new URLSearchParams(hash.slice(1)) // hapus '#' di awal
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')

    if (!accessToken || type !== 'recovery') {
      setTokenValid(false)
      return
    }

    // Set session Supabase agar updateUser bisa berhasil
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || '',
    }).then(({ error: sessionErr }) => {
      if (sessionErr) {
        setTokenValid(false)
      } else {
        setTokenValid(true)
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password.length < 8) {
      setError(t('resetPassword.errors.minLength'))
      return
    }
    if (password !== confirmPassword) {
      setError(t('resetPassword.errors.mismatch'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setSuccess(true)
      // Redirect ke login setelah 3 detik
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.message || t('resetPassword.errors.failed'))
    } finally {
      setLoading(false)
    }
  }

  // ── Loading token check ──
  if (tokenValid === null) {
    return (
      <div className="rp-page">
        <div className="rp-page__checking">
          <div className="rp-spinner" />
          <p>{t('resetPassword.checking')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rp-page">
      <div className="rp-container">
        <div className="rp-grid">
          {/* Left Branding Panel */}
          <div
            className="rp-branding"
            style={{
              background: `
                radial-gradient(circle at 10% 10%, #0066FF 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
                linear-gradient(135deg, #001233 0%, #000814 100%)
              `
            }}
          >
            <div className="rp-branding-bg">
              <img src={nelayanBawaTuna} alt="Nelayan" />
            </div>
            <div className="rp-branding-logo">
              <img src={logoTunafyPutih} alt="Flocify" />
            </div>
            <div
              className="rp-branding-overlay"
              style={{ background: 'linear-gradient(0deg, rgba(0, 83, 173, 0.5) 77.27%, rgba(0, 34, 71, 0) 100%)' }}
            />
            <div className="rp-branding-text">
              <h2>{t('resetPassword.brandingTitle')}</h2>
              <p>{t('resetPassword.brandingDesc')}</p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="rp-form-container">
            <div className="rp-form-wrapper">
              <div className="rp-logo">
                <img src={logoTunafyBiru} alt="Flocify" />
              </div>

              {/* Invalid Token State */}
              {!tokenValid ? (
                <div className="rp-invalid">
                  <div className="rp-invalid-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h1 className="rp-heading">{t('resetPassword.invalidTitle')}</h1>
                  <p className="rp-subheading">{t('resetPassword.invalidDesc')}</p>
                  <Link to="/forgot-password" className="rp-retry-btn">
                    {t('resetPassword.retryLink')}
                  </Link>
                </div>
              ) : !success ? (
                /* Reset Form */
                <>
                  <h1 className="rp-heading">{t('resetPassword.heading')}</h1>
                  <p className="rp-subheading">{t('resetPassword.subheading')}</p>

                  <form className="rp-form" onSubmit={handleSubmit}>
                    {error && <div className="rp-error">{error}</div>}

                    {/* Password Baru */}
                    <div className="rp-field">
                      <label className="rp-label">{t('resetPassword.newPassword')}</label>
                      <div className="rp-password-wrapper">
                        <input
                          id="new-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t('resetPassword.passwordPlaceholder')}
                          className="rp-input"
                          required
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="rp-toggle"
                        >
                          <img src={showPassword ? eyeOpen : eyeClose} alt="" />
                        </button>
                      </div>
                      <p className="rp-hint">{t('resetPassword.passwordHint')}</p>
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="rp-field">
                      <label className="rp-label">{t('resetPassword.confirmPassword')}</label>
                      <div className="rp-password-wrapper">
                        <input
                          id="confirm-password"
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t('resetPassword.confirmPlaceholder')}
                          className="rp-input"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(v => !v)}
                          className="rp-toggle"
                        >
                          <img src={showConfirm ? eyeOpen : eyeClose} alt="" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="rp-submit-btn"
                      id="reset-submit"
                    >
                      {loading ? (
                        <div className="rp-loading-dots">
                          <span /><span /><span />
                        </div>
                      ) : (
                        t('resetPassword.submit')
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="rp-success">
                  <div className="rp-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h1 className="rp-heading">{t('resetPassword.successTitle')}</h1>
                  <p className="rp-success-desc">{t('resetPassword.successDesc')}</p>
                </div>
              )}

              {tokenValid && !success && (
                <div className="rp-back-link">
                  <Link to="/login">← {t('resetPassword.backToLogin')}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
