import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import EyeOpen from '../../assets/images/eye icon-open.svg'
import EyeClose from '../../assets/images/eye icon-close.svg'
import PasswordStrengthIndicator, { isPasswordStrong } from '../../components/PasswordStrengthIndicator'

// Initialize Supabase client for password update
// Using same Supabase credentials as backend (from backend/.env)
const supabaseUrl = 'https://urswdaiswwhegpmfuofl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyc3dkYWlzd3doZWdwbWZ1b2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODgwMDEsImV4cCI6MjA4MDg2NDAwMX0.sNG4hT5UasG68lu27MN5Gu-xq4VluKooH-nNSLbP1ks'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to parse URL hash
const getHashParams = () => {
  const hash = window.location.hash.substring(1) // Remove the #
  const params = new URLSearchParams(hash)
  return {
    accessToken: params.get('access_token'),
    refreshToken: params.get('refresh_token'),
    type: params.get('type'),
    error: params.get('error'),
    errorDescription: params.get('error_description')
  }
}

export default function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('=== RESET PASSWORD DEBUG START ===')
        console.log('Full URL:', window.location.href)
        console.log('Hash:', window.location.hash)

        // First, check if there's an error in the URL hash
        const hashParams = getHashParams()
        console.log('Parsed hash params:', hashParams)

        if (hashParams.error) {
          console.error('Error in URL:', hashParams.error, hashParams.errorDescription)
          setError(hashParams.errorDescription || 'Link reset password tidak valid.')
          setCheckingSession(false)
          return
        }

        // If we have tokens in the hash, set the session
        if (hashParams.accessToken && hashParams.type === 'recovery') {
          console.log('✓ Found recovery tokens in URL hash')
          console.log('Token type:', hashParams.type)
          console.log('Access token (first 20 chars):', hashParams.accessToken?.substring(0, 20) + '...')

          try {
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: hashParams.accessToken,
              refresh_token: hashParams.refreshToken || ''
            })

            if (sessionError) {
              console.error('❌ Session error:', sessionError)
              console.error('Error message:', sessionError.message)
              console.error('Error status:', sessionError.status)
              setError('Link reset password tidak valid atau sudah kadaluarsa. Error: ' + sessionError.message)
              setCheckingSession(false)
              return
            }

            if (data.session) {
              console.log('✓ Session established successfully')
              console.log('Session user:', data.session.user?.email)
              setIsValidSession(true)
              setCheckingSession(false)
              // Clear the hash from URL for cleaner look
              window.history.replaceState(null, '', window.location.pathname)
              return
            } else {
              console.error('❌ No session returned from setSession')
              setError('Gagal membuat session. Silakan coba lagi.')
              setCheckingSession(false)
              return
            }
          } catch (sessionErr) {
            console.error('❌ Exception during setSession:', sessionErr)
            setError('Terjadi kesalahan saat membuat session: ' + sessionErr.message)
            setCheckingSession(false)
            return
          }
        } else {
          console.log('❌ Missing required parameters in hash')
          console.log('Has accessToken?', !!hashParams.accessToken)
          console.log('Type:', hashParams.type)
        }

        // Check for existing session
        console.log('Checking for existing session...')
        const { data: { session }, error: getSessionError } = await supabase.auth.getSession()

        if (getSessionError) {
          console.error('Error getting session:', getSessionError)
        }

        if (session) {
          console.log('✓ Found existing session')
          setIsValidSession(true)
        } else {
          console.log('❌ No existing session found')
          setError('Link reset password tidak valid atau sudah kadaluarsa.')
        }

        console.log('=== RESET PASSWORD DEBUG END ===')
      } catch (err) {
        console.error('❌ Session check error:', err)
        setError('Terjadi kesalahan. Silakan minta link reset password baru.')
      } finally {
        setCheckingSession(false)
      }
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth event:', event)
      if (event === 'PASSWORD_RECOVERY') {
        console.log('✓ PASSWORD_RECOVERY event detected')
        setIsValidSession(true)
        setCheckingSession(false)
      } else if (event === 'SIGNED_IN' && session) {
        console.log('✓ SIGNED_IN event detected')
        setIsValidSession(true)
        setCheckingSession(false)
      }
    })

    // Small delay to let Supabase process the URL hash first
    setTimeout(initializeSession, 100)

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (!isPasswordStrong(password)) {
      setError('Password tidak memenuhi syarat keamanan')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        throw updateError
      }

      setSuccess(true)

      // Sign out after password change
      await supabase.auth.signOut()

    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message || 'Gagal mereset password')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (checkingSession) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-500">Memverifikasi link...</p>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-[420px] bg-white md:shadow-xl md:rounded-[32px] md:p-10 min-h-[100dvh] md:min-h-0 flex flex-col px-6 relative overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#252525] text-center">Password Berhasil Direset!</h1>
            <p className="mt-3 text-[15px] text-gray-500 text-center max-w-[280px]">
              Password Anda telah berhasil diubah. Silakan login dengan password baru.
            </p>
          </div>

          <div className="pb-8 md:pb-0">
            <Link
              to="/login"
              className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#0088FF] text-[16px] font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
            >
              Login Sekarang
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Invalid link state
  if (!isValidSession && !checkingSession) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-[420px] bg-white md:shadow-xl md:rounded-[32px] md:p-10 min-h-[100dvh] md:min-h-0 flex flex-col px-6 relative overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#252525] text-center">Link Tidak Valid</h1>
            <p className="mt-3 text-[15px] text-gray-500 text-center max-w-[280px]">
              {error || 'Link reset password tidak valid atau sudah kadaluarsa. Silakan minta link baru.'}
            </p>
          </div>

          <div className="pb-8 md:pb-0 space-y-3">
            <Link
              to="/forgot-password"
              className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#0088FF] text-[16px] font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
            >
              Minta Link Baru
            </Link>
            <Link
              to="/login"
              className="flex h-[52px] w-full items-center justify-center rounded-2xl border-2 border-gray-200 text-[16px] font-semibold text-gray-600 hover:bg-gray-50 transition-all"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-[420px] bg-white md:shadow-xl md:rounded-[32px] md:p-10 min-h-[100dvh] md:min-h-0 flex flex-col px-6 relative overflow-hidden">
        {/* Header */}
        <div className="pt-12 md:pt-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#252525]">Reset Password</h1>
          <p className="mt-2 text-[15px] text-gray-500 max-w-[280px] mx-auto">
            Masukkan password baru untuk akun Anda.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-500 text-sm text-center rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-[15px] font-medium text-gray-700">Password Baru</label>
            <div className="relative h-[50px] w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 pr-12 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="h-full w-full bg-transparent text-[16px] outline-none placeholder-gray-400 text-gray-800"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src={showPassword ? EyeOpen : EyeClose} alt="" className="h-5 w-5 opacity-60" />
              </button>
            </div>

            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator password={password} />
          </div>

          <div>
            <label className="mb-2 block text-[15px] font-medium text-gray-700">Konfirmasi Password</label>
            <div className="relative h-[50px] w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 pr-12 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password baru"
                className="h-full w-full bg-transparent text-[16px] outline-none placeholder-gray-400 text-gray-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img src={showConfirmPassword ? EyeOpen : EyeClose} alt="" className="h-5 w-5 opacity-60" />
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Password tidak cocok
              </p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="mt-1.5 text-[12px] text-green-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Password cocok
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password || !confirmPassword || password !== confirmPassword || !isPasswordStrong(password)}
            className={`flex h-[52px] w-full items-center justify-center rounded-2xl text-[16px] font-semibold text-white shadow-lg transition-all transform active:scale-95 ${password && confirmPassword && password === confirmPassword
              ? 'bg-[#0088FF] shadow-blue-500/20 hover:bg-blue-600'
              : 'bg-gray-300 cursor-not-allowed shadow-none'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Menyimpan...</span>
              </div>
            ) : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
