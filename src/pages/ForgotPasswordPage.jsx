import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createClient } from '@supabase/supabase-js'
import logoTunafyBiru from '../assets/images/logo icon tunafy (biru).png'
import logoTunafyPutih from '../assets/images/logo icon tunafy (putih).png'
import nelayanBawaTuna from '../assets/images/nelayan bawa tuna.png'
import './ForgotPasswordPage.css'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setError(t('forgotPassword.errors.emailRequired'))
      return
    }

    setLoading(true)
    setError('')
    try {
      // Panggil Supabase langsung dari browser agar redirectTo URL di-whitelistkan dengan benar
      const redirectTo = `${window.location.origin}/reset-password`
      const { error: sbError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })
      if (sbError) throw sbError
      setSuccess(true)
    } catch (err) {
      setError(err.message || t('forgotPassword.errors.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fp-page">
      <div className="fp-container">
        <div className="fp-grid">
          {/* Left Branding Panel */}
          <div
            className="fp-branding"
            style={{
              background: `
                radial-gradient(circle at 10% 10%, #0066FF 0%, transparent 40%),
                radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
                linear-gradient(135deg, #001233 0%, #000814 100%)
              `
            }}
          >
            <div className="fp-branding-bg">
              <img src={nelayanBawaTuna} alt="Nelayan" />
            </div>
            <div className="fp-branding-logo">
              <img src={logoTunafyPutih} alt="Flocify" />
            </div>
            <div
              className="fp-branding-overlay"
              style={{ background: 'linear-gradient(0deg, rgba(0, 83, 173, 0.5) 77.27%, rgba(0, 34, 71, 0) 100%)' }}
            />
            <div className="fp-branding-text">
              <h2>{t('forgotPassword.brandingTitle')}</h2>
              <p>{t('forgotPassword.brandingDesc')}</p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="fp-form-container">
            <div className="fp-form-wrapper">
              {/* Logo */}
              <div className="fp-logo">
                <img src={logoTunafyBiru} alt="Flocify" />
              </div>

              {!success ? (
                <>
                  <h1 className="fp-heading">{t('forgotPassword.heading')}</h1>
                  <p className="fp-subheading">{t('forgotPassword.subheading')}</p>

                  <form className="fp-form" onSubmit={handleSubmit}>
                    {error && <div className="fp-error">{error}</div>}

                    <div className="fp-field">
                      <label className="fp-label">{t('forgotPassword.email')}</label>
                      <input
                        type="email"
                        id="forgot-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('forgotPassword.emailPlaceholder')}
                        className="fp-input"
                        required
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="fp-submit-btn"
                      id="forgot-submit"
                    >
                      {loading ? (
                        <div className="fp-loading-dots">
                          <span /><span /><span />
                        </div>
                      ) : (
                        t('forgotPassword.submit')
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Success State */
                <div className="fp-success">
                  <div className="fp-success-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h1 className="fp-heading">{t('forgotPassword.successTitle')}</h1>
                  <p className="fp-success-desc">{t('forgotPassword.successDesc', { email })}</p>
                  <p className="fp-success-hint">{t('forgotPassword.successHint')}</p>
                </div>
              )}

              <div className="fp-back-link">
                <Link to="/login">← {t('forgotPassword.backToLogin')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
