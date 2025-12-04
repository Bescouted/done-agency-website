import { useState } from 'react'
import { useContentStore } from '../../store/contentStore'
import { API_URL } from '../../config'

export default function ServicesEditor() {
    const { services, addService, removeService, updateService } = useContentStore()

    const handleAdd = () => {
        const newService = {
            id: Date.now(),
            title: 'NEW SERVICE',
            description: 'Description of the service.'
        }
        addService(newService)
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_URL}/api/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(services)
            })

            if (response.ok) {
                alert('Services saved to code!')
            } else {
                alert('Failed to save services.')
            }
        } catch (error) {
            console.error('Error saving services:', error)
            alert('Failed to save services. Is the backend server running?')
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Edit Services Section</h2>
                <div className="flex gap-4">
                    <button
                        onClick={handleAdd}
                        className="bg-electric-blue text-black font-bold py-2 px-4 rounded hover:bg-white transition-colors"
                    >
                        + Add Service
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-black font-bold py-2 px-4 rounded hover:bg-white transition-colors"
                    >
                        SAVE TO CODE
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{service.title}</h3>
                            <button
                                onClick={() => removeService(service.id)}
                                className="text-red-500 hover:text-red-400 text-sm font-mono"
                            >
                                Remove
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={service.title}
                                    onChange={(e) => updateService(service.id, { title: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={service.description}
                                    onChange={(e) => updateService(service.id, { description: e.target.value })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm h-20"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
