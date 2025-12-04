import React, { useState } from 'react';
import { useContentStore } from '../../store/contentStore';
import { motion, AnimatePresence } from 'framer-motion';

const VideoShowcase = () => {
    const { videos } = useContentStore();
    const [selectedVideo, setSelectedVideo] = useState(null);

    const getEmbedUrl = (url) => {
        if (!url) return '';

        // Handle standard youtube.com/watch?v=ID
        if (url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            return `https://www.youtube.com/embed/${urlParams.get('v')}`;
        }

        // Handle youtu.be/ID
        if (url.includes('youtu.be/')) {
            const id = url.split('youtu.be/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }

        // Handle youtube.com/shorts/ID
        if (url.includes('youtube.com/shorts/')) {
            const id = url.split('youtube.com/shorts/')[1].split('?')[0];
            return `https://www.youtube.com/embed/${id}`;
        }

        // Return as is if it's already an embed link or unknown format
        return url;
    };

    return (
        <section id="videos" className="relative w-full min-h-screen bg-black text-white py-20 px-4 md:px-10 flex flex-col z-10">
            {/* Header */}
            <div className="w-full flex justify-between items-end mb-20 border-b border-white/20 pb-4">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">VIDEOS</h2>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                        className="group relative w-full aspect-video cursor-pointer overflow-hidden border border-white/10 hover:border-white/30 transition-colors"
                    >
                        {/* Thumbnail */}
                        <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col justify-end p-6">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{video.title}</h3>
                                <p className="text-sm font-light tracking-widest opacity-80">{video.client}</p>
                            </div>

                            {/* Play Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[10000] p-2 bg-black/20 rounded-full hover:bg-white/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="w-full max-w-6xl aspect-video bg-black shadow-2xl relative">
                            <iframe
                                width="100%"
                                height="100%"
                                src={getEmbedUrl(selectedVideo.videoUrl)}
                                title={selectedVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default VideoShowcase;
