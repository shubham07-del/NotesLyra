import React, { useState, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AuthContext from '../context/AuthContext';

const PaymentModal = ({ pdf, onClose, onSuccess }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    // Dynamic UPI link with exact amount
    const upiLink = `upi://pay?pa=7668046897@paytm&pn=NotesAdmin&am=${pdf.price}&cu=INR`;

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!screenshot) {
            alert('Please upload a screenshot');
            return;
        }

        const formData = new FormData();
        formData.append('pdfId', pdf._id);
        formData.append('screenshot', screenshot);

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };
            await axios.post(`${API_URL}/api/orders`, formData, config);
            setLoading(false);
            onSuccess();
        } catch (error) {
            setLoading(false);
            alert(error.response?.data?.message || 'Order failed');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">X</button>
                <h2 className="text-2xl font-bold mb-4">Purchase {pdf.title}</h2>
                <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">Scan QR Code to Pay <b>₹{pdf.price}</b></p>
                    <img src="/qr_code.jpg" alt="UPI QR Code" className="mx-auto w-48 h-48 object-contain mb-4" />
                    <a href={upiLink} className="text-indigo-600 font-medium hover:underline block mb-4">Click to Pay via UPI App</a>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Payment Screenshot</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setScreenshot(e.target.files[0])}
                            required
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Payment Proof'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
