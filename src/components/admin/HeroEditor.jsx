import { useState } from 'react'
import { useContentStore } from '../../store/contentStore'

export default function HeroEditor() {
    const { hero, setHero } = useContentStore()
    const [localHero, setLocalHero] = useState(hero)

    const handleChange = (e) => {
        const { name, value } = e.target
        setLocalHero(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        setHero(localHero)
        alert('Hero section updated!')
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
                    Save Changes
                </button>
            </div>
        </div>
    )
}
