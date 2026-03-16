import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EyeOpen from '../../assets/images/eye icon-open.svg'
import EyeClose from '../../assets/images/eye icon-close.svg'
import { api } from '../../config/api'
import { useAuth } from '../../context/AuthContext'
import GoogleLoginButton from '../../components/GoogleLoginButton'
import FlocifyLogoWhite from '../../assets/images/Logopack/Flocify_mark white.png'
import FlocifyLogoBlue from '../../assets/images/Logopack/Flocify_mark blue.png'
import MockupImage from '../../assets/images/mockup aplikasi.svg'

export default function Login() {
  const navigate = useNavigate()
  const { login, forceClear } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // AUTO-CLEAR: Bersihkan data lama saat masuk halaman login
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

    setLoading(true)
    setError('')
    try {
      // Normalize identifier if it's a phone number
      let normalizedIdentifier = identifier.trim()

      // If identifier starts with 0 and looks like a phone number, convert to +62
      if (/^0\d{9,12}$/.test(normalizedIdentifier)) {
        normalizedIdentifier = '+62' + normalizedIdentifier.substring(1)
      }
      // If it starts with 8 and looks like a phone number (missing leading 0), add +62
      else if (/^8\d{9,11}$/.test(normalizedIdentifier)) {
        normalizedIdentifier = '+62' + normalizedIdentifier
      }

      const res = await fetch(api.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: normalizedIdentifier,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      const userData = {
        ...data.user,
        token: data.token || data.session?.access_token
      }

      login(userData)
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-white rounded-[32px] md:rounded-[48px] overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 min-h-[500px] lg:min-h-[650px]">
          {/* Left Panel - Blue Gradient (Hidden on mobile) */}
          <div className="hidden lg:flex flex-col rounded-r-[48px] p-12 relative overflow-hidden" style={{
            background: `
              radial-gradient(circle at 10% 10%, #0066FF 0%, transparent 40%),
              radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
              linear-gradient(135deg, #001233 0%, #000814 100%)
            `
          }}>
            {/* Logo Icon - Top Left */}
            <div className="absolute top-12 left-12 z-20">
              <img src={FlocifyLogoWhite} alt="Flocify" className="w-12 h-auto" />
            </div>

            {/* Mockup Aplikasi - From Bottom, Behind Text */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center z-0">
              <img 
                src={MockupImage} 
                alt="Flocify App Mockup" 
                className="w-[120%] max-w-none h-auto"
              />
            </div>

            {/* Gradient Overlay - Behind Text, Above Mockup */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-96 z-5 rounded-br-[48px]"
              style={{
                background: 'linear-gradient(0deg, rgba(0, 83, 173, 0.65) 77.27%, rgba(0, 34, 71, 0) 100%)'
              }}
            />

            {/* Branding text - Bottom, Above Overlay */}
            <div className="mt-auto text-left text-white mb-6 pl-12 pr-6 relative z-10 max-w-4xl">
              <h2 className="text-xl mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>Jual Beli Tanpa Cemas.</h2>
              <p className="text-2xl font-bold text-white leading-relaxed" style={{ fontFamily: 'Montserrat' }}>Wadah terpercaya yang menghubungkan Penghobi dengan Penjual. Transaksi aman, kualitas transparan.</p>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="flex items-center justify-center p-8 lg:pl-8 lg:pr-12 xl:px-16 bg-white lg:w-[550px]">
            <div className="w-full max-w-md">
              {/* Logo Icon - Blue */}
              <div className="mb-8 lg:mb-8">
                <img src={FlocifyLogoBlue} alt="Flocify" className="w-16 h-auto" />
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                Masuk ke akun Anda
              </h1>
              <p className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                Dapatkan akses penuh ke dashboard personalmu dan mulai kelola transaksi ikan dengan mudah.
              </p>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg border border-red-100">
                    {error}
                  </div>
                )}

                {/* Email/Username Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                    Email/Username
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Masukkan email atau username"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <img src={showPassword ? EyeOpen : EyeClose} alt="" className="h-5 w-5 opacity-60" />
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-[#0273FF] text-white font-semibold py-3 rounded-lg hover:bg-[#0160D9] transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  style={{ fontFamily: 'Montserrat' }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    'Masuk'
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">atau</span>
                  </div>
                </div>

                {/* Google Login */}
                <GoogleLoginButton mode="login" />

                {/* Forgot Password Link */}
                <div className="text-center">
                  <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 hover:underline" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                    Lupa kata sandi?
                  </Link>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                  Belum punya akun?{' '}
                  <Link to="/register/step-1" className="text-blue-500 font-semibold hover:text-blue-600 hover:underline">
                    Daftar Sekarang
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
