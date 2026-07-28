import React from 'react';

const LiveBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
            {/* Ambient Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/50 dark:bg-primary-700/30 blur-[80px] animate-blob mix-blend-multiply dark:mix-blend-screen transition-colors duration-700"></div>
            <div className="absolute top-[10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-400/50 dark:bg-indigo-700/30 blur-[80px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen transition-colors duration-700"></div>
            <div className="absolute bottom-[-15%] left-[20%] w-[55%] h-[55%] rounded-full bg-purple-400/50 dark:bg-purple-700/30 blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen transition-colors duration-700"></div>
            <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-pink-400/40 dark:bg-pink-700/20 blur-[90px] animate-blob mix-blend-multiply dark:mix-blend-screen transition-colors duration-700"></div>
            
            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        </div>
    );
};

export default LiveBackground;
