import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('upload'); // upload | manage_pdfs | orders | settings
    const [orders, setOrders] = useState([]);
    const [pdfs, setPdfs] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [semester, setSemester] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Settings state
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [settingsMessage, setSettingsMessage] = useState('');

    const [isFree, setIsFree] = useState(false);

    const { user, login } = useContext(AuthContext);

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        } else if (activeTab === 'manage_pdfs') {
            fetchPdfs();
        }
    }, [activeTab]);

    const fetchPdfs = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/pdfs`);
            setPdfs(data);
        } catch (error) {
            console.error('Error fetching PDFs:', error);
        }
    };

    const handleDeletePDF = async (id) => {
        if (window.confirm('Are you sure you want to delete this PDF?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_URL}/api/pdfs/${id}`, config);
                setPdfs(pdfs.filter(pdf => pdf._id !== id));
            } catch (error) {
                console.error('Error deleting PDF:', error);
                alert('Failed to delete PDF');
            }
        }
    };

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price || 0);
        formData.append('isFree', isFree);
        formData.append('category', category);
        formData.append('semester', semester);
        formData.append('pdf', file);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            await axios.post(`${API_URL}/api/pdfs`, formData, config);
            setMessage('PDF Uploaded Successfully');
            setTitle(''); setDescription(''); setPrice(''); setFile(null); setIsFree(false);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error uploading PDF');
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/orders/${id}`, { status }, config);
            fetchOrders();
        } catch (error) {
            console.error(error);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${API_URL}/api/auth/profile`, {
                email: newEmail || undefined,
                password: newPassword || undefined,
                currentPassword
            }, config);

            // Update local storage with new token
            login(data);

            setSettingsMessage('Profile updated successfully!');
            setNewEmail('');
            setNewPassword('');
            setCurrentPassword('');
            setTimeout(() => setSettingsMessage(''), 3000);
        } catch (error) {
            setSettingsMessage(error.response?.data?.message || 'Update failed');
        }
    };

    return (
        <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Admin Control Center</h1>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden shadow-lg min-h-[600px] flex flex-col md:flex-row">
                    {/* Sidebar Tabs */}
                    <div className="md:w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                📤 Upload PDF
                            </button>
                            <button
                                onClick={() => setActiveTab('manage_pdfs')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'manage_pdfs' ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                📚 Manage PDFs
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                📦 Manage Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                            >
                                ⚙️ Settings
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 bg-white dark:bg-slate-900">
                        {activeTab === 'upload' && (
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Add New Note</h2>
                                {message && (
                                    <div className={`mb-6 p-4 rounded-xl text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} animate-fade-in`}>
                                        {message}
                                    </div>
                                )}
                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" placeholder="e.g. Advanced Calculus Notes" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-field" placeholder="Brief details about the content..." />
                                        </div>
                                        <div className="col-span-2 flex items-center mb-2 mt-2">
                                            <input type="checkbox" id="isFree" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500" />
                                            <label htmlFor="isFree" className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-300">This Note is Free</label>
                                        </div>
                                        {!isFree && (
                                            <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price (INR)</label>
                                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="input-field" placeholder="99" />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="Maths" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Semester</label>
                                            <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} className="input-field" placeholder="3rd Sem" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">PDF File</label>
                                            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-900/30 file:text-primary-700 dark:file:text-primary-400 hover:file:bg-primary-100 dark:hover:file:bg-primary-900/50 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="btn-primary w-full">
                                            Publish Note
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'manage_pdfs' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-6">Manage PDFs</h2>
                                <div className="overflow-hidden bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                            {pdfs.map((pdf) => (
                                                <tr key={pdf._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{pdf.title}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{pdf.semester}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-slate-50">{pdf.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-slate-50">{pdf.isFree ? 'Free' : `₹${pdf.price}`}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button 
                                                            onClick={() => handleDeletePDF(pdf._id)}
                                                            className="text-red-600 hover:text-red-900 transition-colors font-semibold"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pdfs.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                        No PDFs found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-6">Recent Orders</h2>
                                <div className="overflow-hidden bg-white dark:bg-slate-900 shadow-sm rounded-xl border border-slate-200 dark:border-slate-800">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Item</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50">{order.userId?.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{order.userId?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-slate-900 dark:text-slate-50">{order.pdfId?.title}</div>
                                                        <div className="text-xs font-semibold text-green-600 dark:text-green-400">₹{order.amount}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'approved' ? 'bg-green-100 text-green-800' : order.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-xl mx-auto">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-6">Account Settings</h2>
                                {settingsMessage && (
                                    <div className={`mb-6 p-4 rounded-xl text-sm ${settingsMessage.includes('failed') || settingsMessage.includes('incorrect') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} animate-fade-in`}>
                                        {settingsMessage}
                                    </div>
                                )}
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-50 mb-4">Change Email</h3>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="input-field"
                                            placeholder={user?.email || 'New email address'}
                                        />
                                    </div>

                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-50 mb-4">Change Password</h3>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input-field"
                                            placeholder="New password (leave blank to keep current)"
                                        />
                                    </div>

                                    <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/50">
                                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 mb-4">🔒 Verify Identity</h3>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="input-field"
                                            placeholder="Enter your current password"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn-primary w-full">
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

