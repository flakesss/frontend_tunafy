import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { api } from '../../config/api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://urswdaiswwhegpmfuofl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyc3dkYWlzd3doZWdwbWZ1b2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODgwMDEsImV4cCI6MjA4MDg2NDAwMX0.sNG4hT5UasG68lu27MN5Gu-xq4VluKooH-nNSLbP1ks';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OAuthCallback() {
    const [status, setStatus] = useState('Processing...');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        handleOAuthCallback();
    }, []);

    const handleOAuthCallback = async () => {
        try {
            console.log('[OAuth] Starting callback processing...');

            // Get the session from URL hash/params
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('[OAuth] Session error:', sessionError);
                setError('Session error: ' + sessionError.message);
                setStatus('Login gagal');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            if (!session || !session.user) {
                console.error('[OAuth] No session found');
                setError('No session found - please try again');
                setStatus('Tidak ada session');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            console.log('[OAuth] Session found:', session.user.email);
            setStatus('Menyimpan data...');

            // Call backend to handle OAuth user and create/update profile
            console.log('[OAuth] Calling backend...');
            const response = await fetch(`${api.baseURL}/auth/oauth/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: session.user
                })
            });

            const data = await response.json();
            console.log('[OAuth] Backend response:', data);

            if (!response.ok) {
                console.error('[OAuth] Backend error:', data);
                setError('Backend error: ' + (data.error || 'Unknown error'));
                setStatus('Gagal menyimpan data');
                setTimeout(() => navigate('/login'), 3000);
                return;
            }

            console.log('[OAuth] Saving tokens to localStorage...');

            // Store session token
            localStorage.setItem('token', session.access_token);
            localStorage.setItem('user', JSON.stringify(session.user));

            console.log('[OAuth] Login successful! Redirecting to home...');
            setStatus('✅ Login berhasil!');

            // Redirect to home after short delay
            setTimeout(() => {
                window.location.href = '/home'; // Use hard redirect to ensure clean state
            }, 1000);

        } catch (err) {
            console.error('[OAuth] Callback error:', err);
            setError('Error: ' + err.message);
            setStatus('Error occurred');
            setTimeout(() => navigate('/login'), 3000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md px-6">
                <div className="mb-4">
                    {!error ? (
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    ) : (
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>
                <p className="text-lg font-semibold text-gray-700">{status}</p>
                {error && (
                    <p className="text-sm text-red-600 mt-2 bg-red-50 p-3 rounded-lg">{error}</p>
                )}
                {!error && (
                    <p className="text-sm text-gray-500 mt-2">Mohon tunggu...</p>
                )}
            </div>
        </div>
    );
}
