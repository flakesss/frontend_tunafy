import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/Logopack/Flocify_primary blue.png'
import { useAuth } from '../../context/AuthContext'

export default function AuthChoice() {
  const { forceClear } = useAuth()

  // AUTO-CLEAR: Bersihkan data lama saat masuk halaman auth
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    // Jika ada data tapi incomplete, clear semua
    if ((token && !user) || (!token && user)) {
      console.log('Detected incomplete auth data on landing, clearing...')
      forceClear()
    }
  }, [forceClear])

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-[400px] bg-white md:shadow-xl md:rounded-[32px] md:p-8 min-h-[100dvh] md:min-h-0 flex flex-col justify-between md:justify-center relative overflow-hidden">

        {/* Decorative background for mobile (optional) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#FAFAFA] md:hidden -z-10" />

        {/* Middle content: logo + tagline */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 md:pt-0">
          <div className="w-full max-w-[280px] md:max-w-[240px] transition-all duration-500 hover:scale-105">
            <img src={Logo} alt="Flocify" className="w-full h-auto object-contain drop-shadow-sm" />
          </div>
          <p className="mt-6 w-full max-w-[280px] text-center text-[16px] text-gray-500 font-light leading-relaxed">
            Escrow Service Provider
          </p>
        </div>

        {/* Bottom actions: register + login */}
        <div className="space-y-4 px-6 pb-10 md:pb-0 w-full mt-8 md:mt-12">
          <Link
            to="/register/step-1"
            className="flex h-14 w-full items-center justify-center rounded-full bg-[#0088FF] shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:shadow-blue-600/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="text-[18px] font-semibold text-white tracking-wide">Register</span>
          </Link>
          <Link
            to="/login"
            className="flex h-14 w-full items-center justify-center rounded-full border-2 border-[#0088FF] bg-white text-[#0088FF] hover:bg-blue-50 transition-all duration-300"
          >
            <span className="text-[18px] font-semibold tracking-wide">Log In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}


