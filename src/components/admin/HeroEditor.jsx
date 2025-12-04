import { useState, useEffect } from 'react'
import { useContentStore } from '../../store/contentStore'
import { API_URL } from '../../config'

export default function HeroEditor() {
    const { hero, setHero } = useContentStore()
    const [localHero, setLocalHero] = useState(hero)

    // Update local state when store changes (initial load)
    useEffect(() => {
        setLocalHero(hero)
    }, [hero])

    const handleChange = (e) => {
        const { name, value } = e.target
        setLocalHero(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_URL}/api/hero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(localHero)
            })

            if (response.ok) {
                setHero(localHero)
                alert('Hero section saved to code!')
            } else {
                alert('Failed to save hero section.')
            }
        } catch (error) {
            console.error('Error saving hero:', error)
            alert('Failed to save hero section.')
        }
    }

    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Edit Hero Section</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={localHero.title}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-electric-blue focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={localHero.subtitle}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-electric-blue focus:outline-none"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className="bg-electric-blue text-black font-bold py-3 px-6 rounded hover:bg-white transition-colors"
                >
                    SAVE CHANGES TO CODE
                </button>
            </div>
        </div>
    )
}
