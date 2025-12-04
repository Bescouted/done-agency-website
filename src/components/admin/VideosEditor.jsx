import { useState } from 'react'
import { useContentStore } from '../../store/contentStore'
import { API_URL } from '../../config'

export default function VideosEditor() {
    const { videos, addVideo, removeVideo, updateVideo } = useContentStore()

    const handleSave = async () => {
        try {
        } else {
            alert('Upload failed')
        }
    } catch (err) {
        console.error(err)
        alert('Upload failed')
    }
}}
                                        />
    < span className = "text-xs" > UPLOAD</span >
                                    </label >
                                </div >
                            </div >
                        </div >

    <div className="space-y-2">
        <label className="block text-xs font-mono text-gray-400">PREVIEW</label>
        <div className="aspect-video w-full bg-black relative border border-white/10">
            <img src={video.thumbnail} alt="Preview" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white/50">Thumbnail Preview</span>
            </div>
        </div>
    </div>
                    </div >
                </div >
            ))}

<button
    onClick={handleAdd}
    className="w-full py-4 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors"
>
    + ADD NEW VIDEO
</button>
        </div >
    )
}
