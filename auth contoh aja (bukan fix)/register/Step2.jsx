import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArrowLeft from '../../../assets/images/arrow-left Icons.svg'
import { api } from '../../../config/api'
import FlocifyLogoWhite from '../../../assets/images/Logopack/Flocify_mark white.png'
import FlocifyLogoBlue from '../../../assets/images/Logopack/Flocify_mark blue.png'

export default function RegisterStep2() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onRegister = async () => {
    setLoading(true)
    setError('')
    try {
      const step1Raw = localStorage.getItem('reg_step1')
      if (!step1Raw) throw new Error('Missing registration data')
      const step1Data = JSON.parse(step1Raw)

      // Final payload dengan phone + username (email akan ditambah di profile nanti)
      const payload = {
        phone: step1Data.phone,
        username: step1Data.username,
        password: step1Data.password,
        full_name: step1Data.full_name
      }

      const res = await fetch(api.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      console.log('Response status:', res.status) // Debug

      // Better error handling for empty responses
      let data = {}
      const contentType = res.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const text = await res.text()
        console.log('Raw response:', text.substring(0, 200)) // Debug (first 200 chars)
        if (text) {
          try {
            data = JSON.parse(text)
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Text:', text)
            throw new Error('Invalid server response. Check backend console.')
          }
        }
      } else {
        const text = await res.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Server did not return JSON. Check backend console.')
      }

      console.log('Registration response:', data) // Debug log

      if (!res.ok) {
        throw new Error(data.error || `Registration failed with status ${res.status}`)
      }

      // Simpan phone untuk OTP verification
      localStorage.setItem('pending_phone', payload.phone)
      localStorage.setItem('pending_email', payload.email)
      localStorage.removeItem('reg_step1')

      // Always redirect to phone verification for new registrations
      console.log('Redirecting to verify-phone...') // Debug log
      navigate('/verify-phone')

    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message)
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
                src="/src/assets/images/mockup aplikasi.svg" 
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
              {/* Back Button - Mobile */}
              <div className="lg:hidden mb-6">
                <Link to="/register/step-1" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <img src={ArrowLeft} alt="" className="h-5 w-5" />
                  <span className="text-sm font-medium">Kembali</span>
                </Link>
              </div>

              {/* Logo Icon - Blue */}
              <div className="mb-8 lg:mb-8">
                <img src={FlocifyLogoBlue} alt="Flocify" className="w-16 h-auto" />
              </div>

              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                  Selesaikan Pendaftaran
                </h1>
                <p className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                  Klik tombol di bawah untuk menyelesaikan pembuatan akun Anda.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg border border-red-100 mb-6">
                  {error}
                </div>
              )}

              {/* Complete Registration Button */}
              <button
                type="button"
                onClick={onRegister}
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
                  'Selesaikan Pendaftaran'
                )}
              </button>

              {/* Terms Text */}
              <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                Dengan melanjutkan, Anda menyetujui{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Syarat & Ketentuan
                </Link>
                {' '}dan{' '}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Kebijakan Privasi
                </Link>
                {' '}Flocify
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
