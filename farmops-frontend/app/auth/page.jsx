"use client"

import { MyHook } from '@/context/AppProvider';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Page() {

    const router = useRouter();
    const { login, register, authToken } = MyHook();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({});

    useEffect(() => {
        if (authToken) {
            router.push('/dashboard');
        } else {
            router.push('/auth');
        }
    }, [authToken]);


    //handle login
    const validateLogin = () => {
        let newErrors = {};
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            newErrors.email = 'Email is invalid';
        }
        if(!email){
            newErrors.email = 'Email is required';
        }
        if(password.length < 6 || password.length > 20){
            newErrors.password = 'Password must be at least 6 to 20 characters long';
        }
        if(!password){
            newErrors.password = 'Password is required';
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if(validateLogin()){
            setError('');
            setLoading(true);
            try {
                await login(email, password);
            } catch (e) {
                console.error(`ERROR: ${e}`);
                setError('Invalid email or password');
            } finally {
                setLoading(false);
            }
        }
    }

    //handle register
    const validateRegister = () => {
        let newErrors = {};
        if(/^[0-9]+$/.test(name)){
            newErrors.name = 'Name must not be a number';
        }
        if(name.length < 3 || name.length > 20){
            newErrors.name = 'Name must be at least 3 to 20 characters long';
        }
        if(!name){
            newErrors.name = 'Name is required';
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            newErrors.email = 'Email is invalid';
        }
        if(!email){
            newErrors.email = 'Email is required';
        }
        if(!mobile){
            newErrors.mobile = 'Mobile is required';
        }
        if(mobile.length !== 10){
            newErrors.mobile = 'Mobile must be 10 digits';
        }
        if(password.length < 6 || password.length > 20){
            newErrors.password = 'Password must be at least 6 to 20 characters long';
        }
        if(!password){
            newErrors.password = 'Password is required';
        }
        if(confirmPassword.length < 6 || confirmPassword.length > 20){
            newErrors.confirmPassword = 'Confirm Password must be at least 6 to 20 characters long';
        }
        if(confirmPassword !== password){
            newErrors.confirmPassword = 'Confirm Password does not match';
        }
        if(!confirmPassword){
            newErrors.confirmPassword = 'Confirm Password is required';
        }
        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if(!validateRegister()) return;
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        try {
            await register(name, email, mobile, password, confirmPassword);
        } catch (e) {
            console.error(`ERROR: ${e}`);
            setError('Failed to create account');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col gap-5 justify-center items-center p-6'>
            {isLogin ? (
                <div className='w-full max-w-md flex flex-col justify-center items-center gap-2 bg-white py-12 px-10 rounded-3xl shadow-2xl'>
                    <h2 className='mb-8 font-bold text-4xl text-gray-800'>Login</h2>

                    <form onSubmit={handleLoginSubmit} className='w-full flex flex-col gap-5 items-center'>
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Email'
                            type="text"
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error.email && <p className='text-red-500 text-sm'>{error.email}</p>}
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Password'
                            type="password"
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error.password && <p className='text-red-500 text-sm'>{error.password}</p>}
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-full bg-black hover:bg-black/80 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <p className='text-base mt-4 text-gray-600'>
                        <span className='text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors' onClick={() => router.push('/forgot-password')}>Forgot password?</span>
                    </p>
                    <p className='text-base mt-2 text-gray-600'>
                        not have account? <span className='text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors' onClick={() => { setIsLogin(false); setError(''); }}>create one</span>
                    </p>
                </div>
            ) : (
                <div className='w-full max-w-md flex flex-col justify-center items-center gap-2 bg-white py-12 px-10 rounded-3xl shadow-2xl'>
                    <h2 className='mb-8 font-bold text-4xl text-gray-800'>Sign Up</h2>
                    <form onSubmit={handleRegisterSubmit} className='w-full flex flex-col gap-5 items-center'>
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Name'
                            type="text"
                            name='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {error.name && <p className='text-red-500 text-sm'>{error.name}</p>}
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Email'
                            type="text"
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {error.email && <p className='text-red-500 text-sm'>{error.email}</p>}
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Mobile'
                            type="tel"
                            name='mobile'
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                        {error.mobile && <p className='text-red-500 text-sm'>{error.mobile}</p>}
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Password'
                            type="password"
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error.password && <p className='text-red-500 text-sm'>{error.password}</p>}
                        <input
                            className='w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400 text-gray-800'
                            placeholder='Confirm Password'
                            type="password"
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {error.confirmPassword && <p className='text-red-500 text-sm'>{error.confirmPassword}</p>}
                        <button 
                            type="submit"
                            disabled={loading}
                            className='w-full bg-black hover:bg-black/80 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className='text-base mt-6 text-gray-600'>
                        have account? <span className='text-blue-500 hover:text-blue-600 cursor-pointer font-medium transition-colors' onClick={() => { setIsLogin(true); setError(''); }}>Login</span>
                    </p>
                </div>
            )}
        </div>
    )
}

export default Page;