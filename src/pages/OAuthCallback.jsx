import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/axios'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

const OAuthCallback = () => {
  const [status, setStatus] = useState('Memproses login...')
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      // Supabase PKCE / implicit flow menaruh token di URL hash atau
      // langsung di session storage. getSession() handles keduanya.
      // Tapi kita perlu sedikit delay agar Supabase ada waktu parse hash.
      await new Promise((r) => setTimeout(r, 300))

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      // Jika session belum ada, coba exchange code from URL (PKCE flow)
      if (!session) {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        if (code) {
          const { data: exchanged, error: exchErr } = await supabase.auth.exchangeCodeForSession(code)
          if (exchErr || !exchanged?.session) {
            throw new Error(exchErr?.message || 'Gagal tukar code untuk session')
          }
          return continueLogin(exchanged.session)
        }
      }

      if (sessionError || !session?.user) {
        throw new Error(sessionError?.message || 'Session tidak ditemukan')
      }

      await continueLogin(session)

    } catch (err) {
      console.error('[OAuthCallback] Error:', err)
      setStatus('Login gagal. Mengarahkan ulang...')
      setIsError(true)
      setTimeout(() => navigate('/login'), 2500)
    }
  }

  const continueLogin = async (session) => {
    setStatus('Menyinkronkan profil...')

    // Sync profil ke backend (boleh gagal, bukan blocker)
    let dbProfile = null
    try {
      const res = await authAPI.post('/auth/oauth/callback', { user: session.user })
      dbProfile = res.data?.data?.user
    } catch (err) {
      if (err?.response?.status !== 409) {
        console.warn('[OAuthCallback] Backend sync warning:', err?.response?.data?.message)
      }
    }

    // Gabungkan role dari DB ke user object
    const userToLogin = dbProfile
      ? {
          ...session.user,
          user_metadata: {
            ...session.user.user_metadata,
            role: dbProfile.role || 'buyer',
            username: dbProfile.username,
            full_name: dbProfile.full_name,
          },
        }
      : session.user

    login(userToLogin, session.access_token)
    setStatus('✅ Login berhasil!')
    setTimeout(() => navigate('/marketplace'), 800)
  }

  return (
    <div className="oauth-callback-page">
      <div className="oauth-callback-container">
        {!isError ? (
          <div className="oauth-callback-spinner" />
        ) : (
          <div className="oauth-callback-error-icon">✕</div>
        )}
        <p className="oauth-callback-status">{status}</p>
        {!isError && <p className="oauth-callback-hint">Mohon tunggu...</p>}
      </div>

      <style>{`
        .oauth-callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #001233 0%, #000814 100%);
        }
        .oauth-callback-container {
          text-align: center;
          padding: 2rem;
        }
        .oauth-callback-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(0, 102, 255, 0.3);
          border-top-color: #0066FF;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.5rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .oauth-callback-error-icon {
          width: 48px;
          height: 48px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
        }
        .oauth-callback-status {
          color: #f1f5f9;
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.5rem;
        }
        .oauth-callback-hint {
          color: #94a3b8;
          font-size: 0.875rem;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default OAuthCallback
