import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [pdfs, setPdfs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                const { data } = await axios.get('/api/pdfs');
                setPdfs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPdfs();
    }, []);

    const filteredPdfs = pdfs.filter(pdf =>
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-20 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden mb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary-100/80 text-primary-700 text-sm font-semibold mb-6 animate-fade-in border border-primary-200">
                        🚀 Premium Study Material
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight animate-slide-up">
                        Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Studies</span><br />
                        With Expert Notes
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Access quality PDF notes from top educators. Semester exams made easy with paid, high-quality resources.
                    </p>

                    <div className="max-w-2xl mx-auto relative animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <input
                            type="text"
                            placeholder="🔍 Search for biology, physics, or semester 1..."
                            className="w-full px-6 py-4 rounded-full border-0 shadow-xl focus:ring-4 focus:ring-primary-100 text-lg transition-all outline-none pl-14"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute left-5 top-4 text-gray-400 text-xl">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-30">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Available Notes</h2>
                            <span className="text-gray-500 text-sm">{filteredPdfs.length} results found</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPdfs.map(pdf => (
                                <Link to={`/pdf/${pdf._id}`} key={pdf._id} className="group">
                                    <div className="bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
                                        <div className="p-1 bg-gradient-to-r from-primary-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
                                                    {pdf.category || 'General'}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-50 text-green-600 border border-green-100 shadow-sm">
                                                    ₹{pdf.price}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-1">{pdf.title}</h3>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{pdf.description}</p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {pdf.semester ? `Semester ${pdf.semester}` : 'Study Resource'}
                                                </span>
                                                <span className="text-primary-600 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                                                    View Details →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredPdfs.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-medium text-gray-900">No notes found</h3>
                                <p className="text-gray-500">Try adjusting your search terms.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
