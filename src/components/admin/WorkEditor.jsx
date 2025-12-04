import { useState } from 'react'
import { useContentStore } from '../../store/contentStore'

export default function WorkEditor() {
    const { projects, addProject, removeProject, updateProject, updateProjectImage, removeProjectImage } = useContentStore()

    const handleImageUpload = async (e, projectId) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await response.json()

            if (data.filePath) {
                // We need to update the store with the new image path
                // The store action updateProjectImage expects (id, imagePath)
                // But wait, the store might append. Let's check logic.
                // Assuming updateProjectImage appends or we can use updateProject.
                // Let's use updateProject to append to the images array.
                const project = projects.find(p => p.id === projectId)
                if (project) {
                    updateProject(projectId, { images: [...project.images, data.filePath] })
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Is the backend server running?')
        }
    }

    const handleSave = async () => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projects)
            })

            if (response.ok) {
                alert('Projects saved to code!')
            } else {
                alert('Failed to save projects.')
            }
        } catch (error) {
            console.error('Error saving projects:', error)
            alert('Failed to save projects. Is the backend server running?')
        }
    }

    const handleAdd = () => {
        const newProject = {
            id: Date.now(),
            title: 'NEW PROJECT',
            category: 'CATEGORY',
            images: ['https://picsum.photos/seed/new/800/600']
        }
        addProject(newProject)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Work Section</h2>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-electric-blue text-black font-bold rounded hover:bg-white transition-colors"
                >
                    SAVE CHANGES TO CODE
                </button>
            </div>

            {projects.map((project) => (
                <div key={project.id} className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1">PROJECT TITLE</label>
                            <input
                                type="text"
                                value={project.title}
                                onChange={(e) => updateProject(project.id, { title: e.target.value })}
                                className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-electric-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-400 mb-1">CATEGORY</label>
                            <input
                                type="text"
                                value={project.category}
                                onChange={(e) => updateProject(project.id, { category: e.target.value })}
                                className="w-full bg-black/50 border border-white/20 p-2 text-white focus:border-electric-blue outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-gray-400 mb-2">IMAGES</label>
                        <div className="grid grid-cols-4 gap-2">
                            {project.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-video group">
                                    <img src={img} alt={`Project ${idx}`} className="w-full h-full object-cover border border-white/10" />
                                    <button
                                        onClick={() => {
                                            const newImages = project.images.filter((_, i) => i !== idx)
                                            updateProject(project.id, { images: newImages })
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <label className="border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors aspect-video">
                                <span className="text-2xl text-gray-400">+</span>
                                <span className="text-xs text-gray-500 mt-1">Add Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, project.id)}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={handleAdd}
                className="w-full py-4 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white transition-colors"
            >
                + ADD NEW PROJECT
            </button>
        </div>
    )
}
