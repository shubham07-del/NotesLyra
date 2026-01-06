import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('/api/orders/my', config);
                setOrders(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (user) fetchOrders();
    }, [user]);

    const downloadHandler = async (id, title) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob',
            };
            const response = await axios.get(`/api/pdfs/download/${id}`, config);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            alert('Error downloading file');
        }
    };

    return (
        <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
                        <p className="mt-1 text-gray-500">Access all your purchased study materials.</p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl overflow-hidden shadow-lg">
                    {orders.length === 0 ? (
                        <div className="text-center py-20">
                            <span className="text-4xl block mb-4">📚</span>
                            <h3 className="text-lg font-medium text-gray-900">No notes yet</h3>
                            <p className="text-gray-500 mb-6">Start your learning journey today.</p>
                            <Link to="/" className="btn-primary inline-block">Browse Store</Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <li key={order._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-xl">
                                                📝
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-gray-900">{order.pdfId?.title || 'Unknown Note'}</p>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <span className="mr-2">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="ml-2">ID: #{order._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {order.status === 'approved' ? (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                    Ready
                                                </span>
                                            ) : order.status === 'pending' ? (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                                                    Pending Approval
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                                                    Rejected
                                                </span>
                                            )}

                                            {order.status === 'approved' && order.pdfId && (
                                                <button
                                                    onClick={() => downloadHandler(order.pdfId._id, order.pdfId.title)}
                                                    className="bg-white border border-gray-200 text-gray-700 hover:text-primary-600 hover:border-primary-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                                                >
                                                    Download PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
