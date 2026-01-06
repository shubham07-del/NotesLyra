import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('upload'); // upload | orders | payment | settings
    const [orders, setOrders] = useState([]);
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

    // Payment settings state
    const [paymentMode, setPaymentMode] = useState('paid');
    const [paymentMessage, setPaymentMessage] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);

    const { user, login } = useContext(AuthContext);

    useEffect(() => {
        if (activeTab === 'orders') {
            fetchOrders();
        }
        if (activeTab === 'payment') {
            fetchPaymentSettings();
        }
    }, [activeTab]);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/orders`, config);
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPaymentSettings = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/settings/payment`);
            setPaymentMode(data.mode || 'paid');
        } catch (error) {
            console.error(error);
        }
    };

    const handlePaymentSettingsUpdate = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/settings/payment`, { mode: paymentMode }, config);
            setPaymentMessage('Payment settings updated successfully!');
            setTimeout(() => setPaymentMessage(''), 3000);
        } catch (error) {
            setPaymentMessage(error.response?.data?.message || 'Update failed');
        }
        setPaymentLoading(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
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
            setTitle(''); setDescription(''); setPrice(''); setFile(null);
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
        <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden shadow-lg min-h-[600px] flex flex-col md:flex-row">
                    {/* Sidebar Tabs */}
                    <div className="md:w-64 bg-white/50 border-r border-gray-100 p-6">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('upload')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'upload' ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                📤 Upload PDF
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                📦 Manage Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('payment')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'payment' ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                💳 Payment Settings
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-200' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                ⚙️ Settings
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-8 bg-white/30">
                        {activeTab === 'upload' && (
                            <div className="max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Note</h2>
                                {message && (
                                    <div className={`mb-6 p-4 rounded-xl text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} animate-fade-in`}>
                                        {message}
                                    </div>
                                )}
                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" placeholder="e.g. Advanced Calculus Notes" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input-field" placeholder="Brief details about the content..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="input-field" placeholder="99" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="input-field" placeholder="Maths" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                                            <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} className="input-field" placeholder="3rd Sem" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
                                            <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-colors" />
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

                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
                                <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-gray-100">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Proof</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {orders.map((order) => (
                                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{order.userId?.name}</div>
                                                        <div className="text-xs text-gray-500">{order.userId?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{order.pdfId?.title}</div>
                                                        <div className="text-xs font-semibold text-green-600">₹{order.amount}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {order.screenshotPath === 'FREE_ACCESS' ? (
                                                            <span className="text-green-600 text-sm font-medium">Free Access</span>
                                                        ) : (
                                                            <a href={`/api/${order.screenshotPath}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium underline">
                                                                View Image
                                                            </a>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'approved' ? 'bg-green-100 text-green-800' : order.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {order.status === 'pending' && (
                                                            <div className="flex space-x-2">
                                                                <button onClick={() => updateOrderStatus(order._id, 'approved')} className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100 transition-colors">Accept</button>
                                                                <button onClick={() => updateOrderStatus(order._id, 'rejected')} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors">Reject</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="max-w-xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Settings</h2>
                                {paymentMessage && (
                                    <div className={`mb-6 p-4 rounded-xl text-sm ${paymentMessage.includes('failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} animate-fade-in`}>
                                        {paymentMessage}
                                    </div>
                                )}
                                <form onSubmit={handlePaymentSettingsUpdate} className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="font-semibold text-gray-800 mb-4">Access Mode</h3>
                                        <p className="text-sm text-gray-500 mb-4">Choose whether users need to pay for notes or get free access.</p>

                                        <div className="space-y-3">
                                            <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMode === 'paid' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMode"
                                                    value="paid"
                                                    checked={paymentMode === 'paid'}
                                                    onChange={(e) => setPaymentMode(e.target.value)}
                                                    className="h-4 w-4 text-primary-600"
                                                />
                                                <div className="ml-3">
                                                    <span className="font-medium text-gray-900">💳 Paid Mode</span>
                                                    <p className="text-sm text-gray-500">Users must pay and upload screenshot for admin approval</p>
                                                </div>
                                            </label>

                                            <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMode === 'free' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMode"
                                                    value="free"
                                                    checked={paymentMode === 'free'}
                                                    onChange={(e) => setPaymentMode(e.target.value)}
                                                    className="h-4 w-4 text-green-600"
                                                />
                                                <div className="ml-3">
                                                    <span className="font-medium text-gray-900">🆓 Free Mode</span>
                                                    <p className="text-sm text-gray-500">Users get instant access without payment</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                                        <h3 className="font-semibold text-blue-800 mb-2">💡 Current UPI ID</h3>
                                        <p className="text-blue-700 font-mono">lenkasriram1@ybl</p>
                                    </div>

                                    <button type="submit" disabled={paymentLoading} className="btn-primary w-full">
                                        {paymentLoading ? 'Saving...' : 'Save Payment Settings'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="max-w-xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                                {settingsMessage && (
                                    <div className={`mb-6 p-4 rounded-xl text-sm ${settingsMessage.includes('failed') || settingsMessage.includes('incorrect') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} animate-fade-in`}>
                                        {settingsMessage}
                                    </div>
                                )}
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="font-semibold text-gray-800 mb-4">Change Email</h3>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="input-field"
                                            placeholder={user?.email || 'New email address'}
                                        />
                                    </div>

                                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                        <h3 className="font-semibold text-gray-800 mb-4">Change Password</h3>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="input-field"
                                            placeholder="New password (leave blank to keep current)"
                                        />
                                    </div>

                                    <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                                        <h3 className="font-semibold text-yellow-800 mb-4">🔒 Verify Identity</h3>
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

