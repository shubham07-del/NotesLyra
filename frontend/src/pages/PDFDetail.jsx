import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const PDFDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pdf, setPdf] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isPurchased, setIsPurchased] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const { data } = await axios.get('/api/pdfs');
                const foundPdf = data.find(p => p._id === id);
                setPdf(foundPdf);

                if (user) {
                    const { data: myOrders } = await axios.get('/api/orders/my', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    const order = myOrders.find(o => o.pdfId && o.pdfId._id === id && o.status === 'approved');
                    if (order) setIsPurchased(true);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchPdf();
    }, [id, user]);

    if (!pdf) return (
        <div className="min-h-screen pt-24 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    const buyHandler = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const paymentSuccessHandler = () => {
        setShowModal(false);
        alert('Payment submitted! Wait for admin approval.');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative">
            {/* Background Blob */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob"></div>

            <div className="max-w-6xl mx-auto glass-card rounded-3xl overflow-hidden shadow-2xl animate-slide-up flex flex-col md:flex-row min-h-[500px]">

                {/* Left Content */}
                <div className="p-8 md:p-12 md:w-3/5 flex flex-col relative z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-4 w-max">
                        {pdf.category || 'General'}
                    </span>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        {pdf.title}
                    </h1>

                    <div className="mb-8">
                        <span className="text-gray-500 font-medium text-lg block mb-2">Description</span>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {pdf.description}
                        </p>
                    </div>

                    <div className="mt-auto">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-gray-400 text-xs uppercase font-bold block">Semester</span>
                                <span className="text-gray-900 font-semibold">{pdf.semester || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-100 pt-8">
                            <div>
                                <span className="text-gray-400 text-sm font-medium uppercase block mb-1">Price</span>
                                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                                    ₹{pdf.price}
                                </span>
                            </div>

                            {isPurchased ? (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-8 py-4 bg-green-500 text-white rounded-xl shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300 font-bold text-lg flex items-center"
                                >
                                    <span className="mr-2">💾</span> Access File
                                </button>
                            ) : (
                                <button
                                    onClick={buyHandler}
                                    className="px-8 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl shadow-xl hover:shadow-primary-500/40 hover:-translate-y-1 transition-all duration-300 font-bold text-lg animate-pulse"
                                >
                                    Unlock Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className="md:w-2/5 bg-gradient-to-br from-primary-50 to-indigo-50 relative overflow-hidden flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="relative z-10 w-48 h-64 bg-white rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border border-gray-100 flex items-center justify-center group">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gray-200"></div>
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">📄</span>
                        <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-100 rounded"></div>
                        <div className="absolute bottom-8 left-4 right-10 h-2 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </div>

            {showModal && <PaymentModal pdf={pdf} onClose={() => setShowModal(false)} onSuccess={paymentSuccessHandler} />}
        </div>
    );
};

export default PDFDetail;
