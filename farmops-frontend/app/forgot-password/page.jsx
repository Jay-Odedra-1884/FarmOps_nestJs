"use client"

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

function ForgotPasswordPage() {

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setEmail('');
                toast.success(data.message);
            } else {
                setError(data.message || 'Failed to send reset link');
                toast.error(data.message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error("Forgot password failed:", error);
            setError('Failed to send reset link. Please try again.');
            toast.error('Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col gap-5 justify-center items-center p-6'>
            <div className='w-full max-w-md flex flex-col justify-center items-center gap-2 bg-white py-12 px-10 rounded-3xl shadow-2xl'>
                <h2 className='mb-8 font-bold text-4xl text-gray-800'>Forgot Password?</h2>
                
                <p className='text-gray-600 text-center mb-6'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                    <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-green-600 text-sm text-center">
                            Password reset link has been sent to your email!
                        </p>
                    </div>
                )}

                {!success ? (
                    <form onSubmit={handleForgotPasswordSubmit} className='w-full flex flex-col gap-5 items-center'>
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='your@email.com'
                            type="email"
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-full bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <button 
                        onClick={() => router.push('/auth')}
                        className='w-full bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95'
                    >
                        Back to Login
                    </button>
                )}

                <p className='text-base mt-6 text-gray-600'>
                    Remember your password? <span className='text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors' onClick={() => router.push('/auth')}>Login</span>
                </p>
            </div>
        </div>
    )
}

export default ForgotPasswordPage
