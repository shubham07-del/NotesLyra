import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('verified') === 'true') {
            setSuccessMessage('Email successfully verified! You can now log in.');
        } else if (queryParams.get('error') === 'invalid_token') {
            setError('Invalid or expired verification token.');
        }
    }, [location]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            login(data);
            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">


            <div className="max-w-md w-full relative z-10 space-y-8 glass-card p-10 rounded-3xl animate-fade-in">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
                        Sign in to access your premium notes
                    </p>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">{error}</div>}
                {successMessage && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg text-center border border-green-100">{successMessage}</div>}

                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-field mt-1"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="input-field mt-1"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="btn-primary w-full py-3 text-lg shadow-lg hover:shadow-xl"
                        >
                            Sign In
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
