import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        {/* Logo Icon */}
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg mr-3 transform hover:rotate-12 transition-transform duration-300">
                            N
                        </div>
                        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-indigo-600 tracking-tight">
                            NotesLyra
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>

                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <NavLink to="/admin" active={isActive('/admin')}>Admin Dashboard</NavLink>
                                ) : (
                                    <NavLink to="/dashboard" active={isActive('/dashboard')}>My Notes</NavLink>
                                )}
                                <button onClick={logoutHandler} className="ml-4 bg-white/50 hover:bg-red-50 text-red-600 border border-red-200 px-5 py-2 rounded-full transition-all duration-300 font-medium hover:shadow-md">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" active={isActive('/login')}>Login</NavLink>
                                <Link to="/signup" className="ml-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 transform hover:-translate-y-0.5 font-medium">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${active ? 'text-primary-700' : 'text-gray-600 hover:text-primary-600'}`}
    >
        {children}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`}></span>
    </Link>
);

export default Navbar;
