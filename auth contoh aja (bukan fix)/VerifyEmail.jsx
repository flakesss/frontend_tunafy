import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../config/api'

export default function VerifyEmail() {
  const email = localStorage.getItem('pending_email') || 'email Anda'
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleResend = async () => {
    setResending(true)
    setResendMessage('')
    try {
      const res = await fetch(api.resendVerification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (res.ok) {
        setResendMessage('Email verifikasi telah dikirim ulang!')
      } else {
        setResendMessage('Gagal mengirim ulang. Coba lagi nanti.')
      }
    } catch (err) {
      setResendMessage('Gagal mengirim ulang. Coba lagi nanti.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white shadow-xl rounded-[32px] p-8 md:p-10 text-center">
        {/* Email Icon */}
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">Cek Email Anda</h1>
        
        <p className="text-gray-500 mb-2">
          Kami telah mengirim link verifikasi ke
        </p>
        <p className="font-semibold text-gray-700 mb-6 break-all">
          {email}
        </p>

        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
          <p className="text-sm text-blue-700">
            Klik link di email tersebut untuk mengaktifkan akun Anda, lalu login.
          </p>
        </div>

        {resendMessage && (
          <div className={`mb-4 p-3 rounded-xl text-sm ${resendMessage.includes('Gagal') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {resendMessage}
          </div>
        )}

        <Link 
          to="/login" 
          className="block w-full py-3.5 bg-[#0088FF] text-white font-semibold rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
        >
          Kembali ke Login
        </Link>

        <p className="mt-6 text-sm text-gray-400">
          Tidak menerima email?{' '}
          <button 
            onClick={handleResend}
            disabled={resending}
            className="text-[#0088FF] font-medium hover:underline disabled:opacity-50"
          >
            {resending ? 'Mengirim...' : 'Kirim Ulang'}
          </button>
        </p>

        <p className="mt-4 text-xs text-gray-400">
          Pastikan cek folder spam jika tidak menemukan email.
        </p>
      </div>
    </div>
  )
}

