import { useState } from 'react'
import { useContentStore } from '../../store/contentStore'

export default function VideosEditor() {
    const { videos, addVideo, removeVideo, updateVideo } = useContentStore()

    const handleSave = async () => {
        try {
            // We'll use a generic endpoint or a specific one if available.
            // Based on WorkEditor, it posts to /api/projects. 
            // I'll assume /api/videos or I might need to check server.js.
            // Let's check server.js first to see if I need to add an endpoint.
            // But for now I'll write the component assuming I'll fix the backend if needed.
            // Actually, I should check server.js first.
            // But I can write this and then check server.js.
            const response = await fetch('/api/videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(videos)
            })

            if (response.ok) {
                alert('Videos saved to code!')
            } else {
                alert('Failed to save videos.')
            }
        } catch (error) {
            console.error('Error saving videos:', error)
            alert('Failed to save videos. Is the backend server running?')
        }
    }

    const handleAdd = () => {
        const newVideo = {
            id: Date.now(),
            title: 'NEW VIDEO',
            client: 'CLIENT NAME',
            thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
        addVideo(newVideo)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Videos Section</h2>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-electric-blue text-black font-bold rounded hover:bg-white transition-colors"
                >
                    SAVE CHANGES TO CODE
                </button>
            </div>

            {videos.map((video) => (
                <div key={video.id} className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-4 relative group">
                    <button
                        onClick={() => removeVideo(video.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Remove
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">VIDEO TITLE</label>
                                <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => updateVideo(video.id, { title: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-electric-blue outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">CLIENT</label>
                                <input
                                    type="text"
                                    value={video.client}
                                    onChange={(e) => updateVideo(video.id, { client: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-electric-blue outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">VIDEO URL (Embed Link)</label>
                                <input
                                    type="text"
                                    value={video.videoUrl}
                                    onChange={(e) => updateVideo(video.id, { videoUrl: e.target.value })}
                                    className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-electric-blue outline-none"
                                    placeholder="https://www.youtube.com/embed/..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">THUMBNAIL URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={video.thumbnail}
                                        onChange={(e) => updateVideo(video.id, { thumbnail: e.target.value })}
                                        className="flex-1 bg-black/50 border border-white/20 p-2 text-white focus:border-electric-blue outline-none"
                                    />
                                    <label className="cursor-pointer px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors flex items-center justify-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0]
                                                if (!file) return

                                                const formData = new FormData()
                                                formData.append('image', file)

                                                try {
                                                    const res = await fetch('/api/upload', {
                                                        method: 'POST',
                                                        body: formData
                                                    })

                                                    if (res.ok) {
                                                        const data = await res.json()
                                                        updateVideo(video.id, { thumbnail: data.filePath })
                                                    } else {
                                                        alert('Upload failed')
                                                    }
                                                } catch (err) {
                                                    console.error(err)
                                                    alert('Upload failed')
                                                }
                                            }}
                                        />
                                        <span className="text-xs">UPLOAD</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-mono text-gray-400">PREVIEW</label>
                            <div className="aspect-video w-full bg-black relative border border-white/10">
                                <img src={video.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs text-white/50">Thumbnail Preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-4 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors"
            >
                + ADD NEW VIDEO
            </button>
        </div>
    )
}
