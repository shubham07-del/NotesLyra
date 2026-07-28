import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const [scrolled, setScrolled] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    useEffect(() => {
        const isDark = !('darkMode' in localStorage) || localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(isDark);
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        {/* Logo Icon */}
                        <div>
                            <img src="/nursing-vidya.jpeg" alt="" className='h-10 w-auto' />
                        </div>
                        <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-indigo-600 tracking-tight">
                            Nursing Vidya
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xl">
                            {isDarkMode ? '🌙' : '☀️'}
                        </button>
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xl">
                            {isDarkMode ? '🌙' : '☀️'}
                        </button>
                        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 focus:outline-none">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-indigo-600">Menu</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col p-6 space-y-6 flex-1 overflow-y-auto">
                    <Link to="/" onClick={() => setIsSidebarOpen(false)} className={`text-lg font-medium ${isActive('/') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`}>Home</Link>
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className={`text-lg font-medium ${isActive('/admin') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`}>Admin Dashboard</Link>
                            ) : (
                                <Link to="/dashboard" onClick={() => setIsSidebarOpen(false)} className={`text-lg font-medium ${isActive('/dashboard') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`}>My Notes</Link>
                            )}
                            <button onClick={() => { setIsSidebarOpen(false); logoutHandler(); }} className="w-full text-left text-lg font-medium text-red-600 hover:text-red-700 mt-4">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsSidebarOpen(false)} className={`text-lg font-medium ${isActive('/login') ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'}`}>Login</Link>
                            <Link to="/signup" onClick={() => setIsSidebarOpen(false)} className="w-full text-center bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg mt-4 font-medium">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 ${active ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'}`}
    >
        {children}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transform transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`}></span>
    </Link>
);

export default Navbar;
