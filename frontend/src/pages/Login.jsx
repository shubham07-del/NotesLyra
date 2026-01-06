import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

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
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[40%] right-[20%] w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full relative z-10 space-y-8 glass-card p-10 rounded-3xl animate-fade-in">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to access your premium notes
                    </p>
                </div>

                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
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
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
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
                    <p className="text-sm text-gray-600">
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
