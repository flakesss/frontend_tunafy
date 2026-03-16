import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../config/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showEmailHint, setShowEmailHint] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {
      const res = await fetch(api.forgotPassword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
        <div className="w-full max-w-[420px] bg-white md:shadow-xl md:rounded-[32px] md:p-10 min-h-[100dvh] md:min-h-0 flex flex-col px-6 relative overflow-hidden">
          {/* Success State */}
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#252525] text-center">Cek Email Anda</h1>
            <p className="mt-3 text-[15px] text-gray-500 text-center max-w-[280px]">
              Kami telah mengirim link untuk reset password ke <strong>{email}</strong>
            </p>
            <p className="mt-2 text-[13px] text-gray-400 text-center">
              Tidak menerima email? Cek folder spam Anda.
            </p>
          </div>

          <div className="pb-8 md:pb-0 space-y-4">
            <Link
              to="/login"
              className="flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#0088FF] text-[16px] font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
            >
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
      <div className="w-full max-w-[420px] bg-white md:shadow-xl md:rounded-[32px] md:p-10 min-h-[100dvh] md:min-h-0 flex flex-col px-6 relative overflow-hidden">
        {/* Back Button */}
        <Link
          to="/login"
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Header */}
        <div className="pt-24 md:pt-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-[28px] font-bold text-[#252525]">Lupa Password?</h1>
          <p className="mt-2 text-[15px] text-gray-500 max-w-[280px] mx-auto">
            Masukkan email Anda dan kami akan mengirim link untuk reset password.
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
            <label className="mb-2 block text-[15px] font-medium text-gray-700">Email Address</label>
            <div className="h-[50px] w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email Anda"
                className="h-full w-full bg-transparent text-[16px] outline-none placeholder-gray-400 text-gray-800"
                required
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Gunakan email yang sudah terdaftar di akun Anda
            </p>
          </div>

          {/* Info Card untuk user tanpa email */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-900">Belum punya email di akun?</p>
                <p className="text-xs text-amber-700 mt-1">
                  Tambahkan email di halaman profil terlebih dahulu untuk bisa menggunakan fitur reset password.
                </p>
                <Link
                  to="/profile"
                  className="inline-block mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                >
                  Tambah Email Sekarang →
                </Link>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className={`flex h-[52px] w-full items-center justify-center rounded-2xl text-[16px] font-semibold text-white shadow-lg transition-all transform active:scale-95 ${email
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
                <span>Mengirim...</span>
              </div>
            ) : 'Kirim Link Reset'}
          </button>
        </form>

        {/* Back to login */}
        <div className="mt-auto md:mt-8 pb-8 md:pb-0">
          <p className="text-center text-[15px] text-gray-500">
            Ingat password Anda?{' '}
            <Link to="/login" className="text-[#0088FF] font-semibold hover:text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
