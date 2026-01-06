import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PDFDetail from './pages/PDFDetail';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/pdf/:id" element={<PDFDetail />} />
                        <Route path="/dashboard" element={<PrivateUserRoute><UserDashboard /></PrivateUserRoute>} />
                        <Route path="/admin" element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>} />
                    </Routes>
                </main>
            </AuthProvider>
        </Router>
    );
}

const PrivateUserRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    return user ? children : <Navigate to="/login" />;
};

const PrivateAdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

export default App;
