import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const PDFDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pdf, setPdf] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch PDF
                const { data } = await axios.get(`${API_URL}/api/pdfs`);
                const foundPdf = data.find(p => p._id === id);
                setPdf(foundPdf);

                if (user) {
                    const { data: myOrders } = await axios.get(`${API_URL}/api/orders/my`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    const order = myOrders.find(o => o.pdfId && o.pdfId._id === id && o.status === 'approved');
                    if (order) setIsPurchased(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id, user]);

    if (!pdf) return (
        <div className="min-h-screen pt-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    const buyHandler = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        // If free mode, grant access immediately
        if (pdf.isFree) {
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post(`${API_URL}/api/orders/free`, { pdfId: pdf._id }, config);
                setLoading(false);
                alert('Access granted! You can now download the notes.');
                navigate('/dashboard');
            } catch (error) {
                setLoading(false);
                alert(error.response?.data?.message || 'Failed to get access');
            }
            return;
        }

        // Paid mode - show payment modal
        setShowModal(true);
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative">


            <div className="max-w-6xl mx-auto glass-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col md:flex-row min-h-[500px]">

                {/* Left Content */}
                <div className="p-8 md:p-12 md:w-3/5 flex flex-col relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-bold tracking-wide uppercase mb-4 w-max">
                        {pdf.category || 'General'}
                    </span>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
                        {pdf.title}
                    </h1>

                    <div className="mb-8">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-lg block mb-2">Description</span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                            {pdf.description}
                        </p>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                <span className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold block">Semester</span>
                                <span className="text-slate-900 dark:text-slate-50 font-semibold">{pdf.semester || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-8">
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 text-sm font-medium uppercase block mb-1">Price</span>
                                {pdf.isFree ? (
                                    <span className="text-4xl font-extrabold text-green-600">
                                        FREE
                                    </span>
                                ) : (
                                    <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                                        ₹{pdf.price}
                                    </span>
                                )}
                            </div>

                            {isPurchased ? (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-8 py-4 bg-green-500 text-white rounded-xl shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center"
                                >
                                    <span className="mr-2">💾</span>Access File
                                </button>
                            ) : (
                                <button
                                    onClick={buyHandler}
                                    disabled={loading}
                                    className={`px-8 py-4 ${pdf.isFree ? 'bg-green-500 hover:shadow-green-500/40' : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:shadow-primary-500/40'} text-white rounded-xl shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold text-lg ${!pdf.isFree ? 'animate-pulse' : ''} disabled:opacity-50`}
                                >
                                    {loading ? 'Getting Access...' : pdf.isFree ? 'Get Free Access' : 'Unlock Now'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="md:w-2/5 bg-slate-50 dark:bg-slate-900 relative overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="relative z-10 w-48 h-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center group">
                        <div className="absolute inset-x-0 top-0 h-1 bg-slate-200 dark:bg-slate-700"></div>
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">📄</span>
                        <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                        <div className="absolute bottom-8 left-4 right-10 h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>

            {showModal && (
                <PaymentModal 
                    pdf={pdf} 
                    onClose={() => setShowModal(false)} 
                    onSuccess={() => { 
                        setShowModal(false); 
                        setIsPurchased(true); 
                    }} 
                />
            )}
        </div>
    );
};

export default PDFDetail;

