import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../config/api'

export default function VerifyPhone() {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [resending, setResending] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [phone, setPhone] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const pendingPhone = localStorage.getItem('pending_phone')
        if (!pendingPhone) {
            navigate('/register/step-1')
            return
        }
        setPhone(pendingPhone)

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    const handleVerify = async (e) => {
        e.preventDefault()

        if (!otp || otp.length < 6) {
            setError('Please enter a valid 6-digit OTP')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${api.baseURL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, token: otp })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'OTP verification failed')
            }

            // Success! Clear pending data and redirect to login
            localStorage.removeItem('pending_phone')
            localStorage.removeItem('pending_email')

            navigate('/login', {
                state: { message: 'Registration successful! Please login.' }
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        setError('')

        try {
            const res = await fetch(`${api.baseURL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to resend OTP')
            }

            // Reset countdown
            setCountdown(60)
            setCanResend(false)

            alert('OTP sent successfully!')
        } catch (err) {
            setError(err.message)
        } finally {
            setResending(false)
        }
    }

    const maskPhone = (phoneNumber) => {
        if (!phoneNumber || phoneNumber.length < 4) return phoneNumber
        const visibleDigits = 4
        const start = phoneNumber.slice(0, visibleDigits)
        const masked = '*'.repeat(phoneNumber.length - visibleDigits)
        return `${start}${masked}`
    }

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-0 md:p-4">
            <div className="w-full max-w-[420px] bg-white md:shadow-xl md:rounded-[32px] md:p-10 min-h-[100dvh] md:min-h-0 flex flex-col px-6 relative overflow-hidden">
                {/* Header */}
                <div className="pt-24 md:pt-4 text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-[28px] font-bold text-[#252525]">Verify Phone Number</h1>
                    <p className="mt-3 text-[15px] text-gray-500 max-w-[300px] mx-auto">
                        We've sent a 6-digit verification code to <strong>{maskPhone(phone)}</strong>
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleVerify}>
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm text-center rounded-2xl border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-[15px] font-medium text-gray-700 text-center">
                            Enter OTP Code
                        </label>
                        <div className="h-[56px] w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="h-full w-full bg-transparent text-[24px] text-center font-bold outline-none placeholder-gray-300 text-gray-800 tracking-widest"
                                maxLength={6}
                                pattern="[0-9]{6}"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length < 6}
                        className={`flex h-[52px] w-full items-center justify-center rounded-2xl text-[16px] font-semibold text-white shadow-lg transition-all transform active:scale-95 ${otp.length === 6 && !loading
                            ? 'bg-[#0088FF] shadow-blue-500/20 hover:bg-blue-600'
                            : 'bg-gray-300 cursor-not-allowed shadow-none'
                            }`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Verifying...</span>
                            </div>
                        ) : 'Verify'}
                    </button>
                </form>

                {/* Resend OTP */}
                <div className="mt-6 text-center">
                    <p className="text-[14px] text-gray-500">
                        Didn't receive the code?{' '}
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending}
                                className="text-[#0088FF] font-semibold hover:text-blue-600 hover:underline disabled:opacity-50"
                            >
                                {resending ? 'Sending...' : 'Resend OTP'}
                            </button>
                        ) : (
                            <span className="text-gray-400">
                                Resend in {countdown}s
                            </span>
                        )}
                    </p>
                </div>

                {/* Back to registration */}
                <div className="mt-auto md:mt-8 pb-8 md:pb-0">
                    <Link
                        to="/register/step-1"
                        className="block text-center text-[15px] text-gray-500 hover:text-gray-700"
                    >
                        ← Back to Registration
                    </Link>
                </div>
            </div>
        </div>
    )
}
