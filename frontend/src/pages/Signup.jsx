import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full relative z-10 space-y-8 glass-card p-10 rounded-3xl animate-fade-in">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-gray-900 tracking-tight">Create Account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join thousands of students learning effectively
                    </p>
                </div>
                {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100">{error}</div>}

                <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="input-field mt-1"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                                placeholder="Create a strong password"
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
                            Get Started
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
