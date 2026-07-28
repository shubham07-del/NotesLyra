import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const PaymentModal = ({ pdf, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const handleRazorpayPayment = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Create Razorpay Order
            const { data } = await axios.post(`${API_URL}/api/orders/razorpay/create`, { pdfId: pdf._id }, config);
            
            const options = {
                key: "rzp_test_TIsflHt9PAEqFC", // Razorpay ID
                amount: data.razorpayOrder.amount,
                currency: "INR",
                name: "Nursing Vidya",
                description: `Purchase ${pdf.title}`,
                order_id: data.razorpayOrder.id,
                handler: async function (response) {
                    try {
                        // Verify Payment
                        await axios.post(`${API_URL}/api/orders/razorpay/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, config);
                        
                        onSuccess();
                    } catch (verifyError) {
                        alert(verifyError.response?.data?.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#4f46e5"
                }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert(response.error.description);
            });
            rzp.open();
            setLoading(false);
            
            // Close the modal right away since razorpay opens its own overlay
            onClose();
        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.message || 'Failed to initialize payment');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">X</button>
                <h2 className="text-2xl font-bold mb-4">Complete Purchase</h2>
                <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">You are about to purchase <b>{pdf.title}</b></p>
                    <p className="text-2xl font-extrabold text-indigo-600 mb-4">₹{pdf.price}</p>
                </div>

                <button
                    onClick={handleRazorpayPayment}
                    disabled={loading}
                    className="w-full flex justify-center items-center bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-bold transition duration-300"
                >
                    {loading ? 'Initializing...' : 'Pay with Razorpay'}
                </button>
                
                <p className="text-xs text-center text-gray-400 mt-4">Secured by Razorpay</p>
            </div>
        </div>
    );
};

export default PaymentModal;
