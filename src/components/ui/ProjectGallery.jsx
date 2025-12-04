import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectGallery = ({ project, isOpen, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Reset index when project changes
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            setIsLoading(true);
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, project]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    if (!project || !project.images || project.images.length === 0) return null;

    const nextImage = () => {
        setIsLoading(true);
        setCurrentIndex((prev) => (prev + 1) % project.images.length);
    };

    const prevImage = () => {
        setIsLoading(true);
        setCurrentIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out"
                    onClick={onClose} // Close on backdrop click
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[10000] p-2 bg-black/20 rounded-full hover:bg-white/10"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    {/* Main Image Container */}
                    <div
                        className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4 cursor-default"
                        onClick={(e) => e.stopPropagation()} // Prevent close on image click
                    >
                        {/* Loading Spinner */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-0">
                                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}

                        <AnimatePresence mode='wait'>
                            <motion.img
                                key={`${project.id}-${currentIndex}`}
                                src={project.images[currentIndex]}
                                alt={`${project.title} - ${currentIndex + 1}`}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onLoad={() => setIsLoading(false)}
                                onError={() => setIsLoading(false)}
                                className="relative z-10 max-w-full max-h-full object-contain select-none shadow-2xl"
                            />
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {project.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 hover:bg-white/5 rounded-full z-20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 hover:bg-white/5 rounded-full z-20"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Counter / Info */}
                        <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 text-white/50 text-sm font-light tracking-widest">
                            {currentIndex + 1} / {project.images.length}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectGallery;
