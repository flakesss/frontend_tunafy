import React, { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ArrowLeft from '../../../assets/images/arrow-left Icons.svg'
import EyeOpen from '../../../assets/images/eye icon-open.svg'
import EyeClose from '../../../assets/images/eye icon-close.svg'
import { api } from '../../../config/api'
import PasswordStrengthIndicator, { isPasswordStrong } from '../../../components/PasswordStrengthIndicator'
import GoogleLoginButton from '../../../components/GoogleLoginButton'
import FlocifyLogoWhite from '../../../assets/images/Logopack/Flocify_mark white.png'
import FlocifyLogoBlue from '../../../assets/images/Logopack/Flocify_mark blue.png'
import MockupImage from '../../../assets/images/mockup aplikasi 2.svg'

// Debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function RegisterStep1() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [legalDocs, setLegalDocs] = useState({ terms: null, privacy: null })

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    password: ''
  })

  // Availability states
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: null, message: '' })
  const [phoneStatus, setPhoneStatus] = useState({ checking: false, available: null, message: '' })

  const navigate = useNavigate()

  // Fetch legal documents on mount
  useEffect(() => {
    fetch(api.legal.all)
      .then(res => res.json())
      .then(data => setLegalDocs(data))
      .catch(err => console.error('Failed to load legal docs:', err));
  }, []);

  // Debounced values for API calls
  const debouncedUsername = useDebounce(formData.username, 500)
  const debouncedPhone = useDebounce(formData.phone, 500)

  // Check availability function
  const checkAvailability = useCallback(async (type, value) => {
    if (!value) return { available: null, message: '' }

    try {
      const res = await fetch(`${api.baseURL}/auth/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value })
      })
      const data = await res.json()

      if (data.available) {
        return { available: true, message: 'Available ✓' }
      } else {
        return { available: false, message: `${type.charAt(0).toUpperCase() + type.slice(1)} already taken` }
      }
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
      setUsernameStatus({ checking: false, available: false, message: 'Min 3 characters' })
    } else {
      setUsernameStatus({ checking: false, available: null, message: '' })
    }
  }, [debouncedUsername, checkAvailability])

  // Check phone availability
  useEffect(() => {
    if (debouncedPhone && debouncedPhone.length >= 10) {
      setPhoneStatus({ checking: true, available: null, message: '' })
      checkAvailability('phone', debouncedPhone).then(result => {
        setPhoneStatus({ checking: false, ...result })
      })
    } else if (debouncedPhone) {
      setPhoneStatus({ checking: false, available: false, message: 'Min 10 digits' })
    } else {
      setPhoneStatus({ checking: false, available: null, message: '' })
    }
  }, [debouncedPhone, checkAvailability])

  // Check email availability
  const onChange = (e) => {
    const { name, value } = e.target

    // Special handling for phone number - auto-format to E.164
    if (name === 'phone') {
      let formatted = value.replace(/\D/g, '') // Remove non-digits

      // If starts with 0, replace with +62
      if (formatted.startsWith('0')) {
        formatted = '+62' + formatted.substring(1)
      }
      // If doesn't start with +, assume Indonesia and add +62
      else if (!value.startsWith('+')) {
        formatted = '+62' + formatted
      }
      // If starts with 62, add +
      else if (formatted.startsWith('62')) {
        formatted = '+' + formatted
      }
      // Otherwise keep as-is (already has +)
      else {
        formatted = value
      }

      setFormData({ ...formData, [name]: formatted })
    }
    else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const onNext = (e) => {
    e.preventDefault()

    // Validasi availability (email optional)
    if (usernameStatus.available === false || phoneStatus.available === false) {
      setError('Please fix the errors before continuing')
      return
    }

    // Simpan data form
    localStorage.setItem('reg_step1', JSON.stringify(formData))
    navigate('/register/step-2')
  }

  const isFormValid = formData.full_name && formData.username && formData.phone && formData.password && isPasswordStrong(formData.password) && agreedToTerms

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

            {/* Mockup Aplikasi - Centered */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
              <img 
                src={MockupImage} 
                alt="Flocify App Mockup" 
                className="w-[130%] max-w-none h-auto"
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
                Buat Akun Baru
              </h1>
              <p className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                Bergabunglah dengan Flocify dan mulai bertransaksi ikan hias dengan aman.
              </p>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm text-center rounded-lg border border-red-100 mb-6">
                  {error}
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={onNext}>
                {/* Full name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={onChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={onChange}
                    placeholder="Masukkan username"
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                      usernameStatus.available === true ? 'border-green-500 focus:ring-green-500/10' :
                      usernameStatus.available === false ? 'border-red-500 focus:ring-red-500/10' :
                      'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
                    }`}
                    pattern="[a-zA-Z0-9_.]{3,20}"
                    title="3-20 characters, letters, numbers, underscore, dot only"
                    required
                  />
                  {usernameStatus.message && (
                    <p className={`mt-1 text-xs ${usernameStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                      {usernameStatus.checking ? 'Checking...' : usernameStatus.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="081234567890"
                    className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all ${
                      phoneStatus.available === true ? 'border-green-500 focus:ring-green-500/10' :
                      phoneStatus.available === false ? 'border-red-500 focus:ring-red-500/10' :
                      'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
                    }`}
                    required
                  />
                  {phoneStatus.message && (
                    <p className={`mt-1 text-xs ${phoneStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                      {phoneStatus.checking ? 'Checking...' : phoneStatus.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Montserrat' }}>
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={onChange}
                      placeholder="Buat kata sandi"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <img src={showPassword ? EyeOpen : EyeClose} alt="" className="h-5 w-5 opacity-60" />
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator password={formData.password} />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="agree-terms" className="text-xs text-gray-600 leading-relaxed cursor-pointer" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                    Saya telah membaca dan menyetujui{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Syarat & Ketentuan
                    </button>
                    {' '}dan{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/privacy')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Kebijakan Privasi
                    </button>
                    {' '}Flocify
                  </label>
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full bg-[#0273FF] text-white font-semibold py-3 rounded-lg hover:bg-[#0160D9] transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 ${
                    !isFormValid ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Lanjutkan
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

                {/* Google Sign Up */}
                <GoogleLoginButton mode="register" />

                {/* Sign In Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat', fontWeight: 400 }}>
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600 hover:underline">
                      Masuk Sekarang
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
