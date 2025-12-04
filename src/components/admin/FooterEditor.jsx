import { useState } from 'react'
import { useContentStore } from '../../store/contentStore'
import { API_URL } from '../../config'

export default function FooterEditor() {
    const { footer, setFooter } = useContentStore()
    const [localFooter, setLocalFooter] = useState(footer)

    const handleChange = (e) => {
        const { name, value } = e.target
        setLocalFooter(prev => ({ ...prev, [name]: value }))
    }

    const handleSocialChange = (index, field, value) => {
        const newSocials = [...localFooter.socials]
        newSocials[index] = { ...newSocials[index], [field]: value }
        setLocalFooter(prev => ({ ...prev, socials: newSocials }))
    }

    const handleSave = async () => {
        setFooter(localFooter)

        try {
            const response = await fetch(`${API_URL}/api/footer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(localFooter)
            })

            if (response.ok) {
                alert('Footer updated and saved to code!')
            } else {
                alert('Failed to save footer to code.')
            }
        } catch (error) {
            console.error('Error saving footer:', error)
            alert('Failed to save footer. Is the backend server running?')
        }
    }

    return (
        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Edit Footer Section</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={localFooter.email}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-electric-blue focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={localFooter.address}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-electric-blue focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-mono text-gray-400 mb-2">Social Links</label>
                    <div className="space-y-3">
                        {localFooter.socials.map((social, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={social.name}
                                    onChange={(e) => handleSocialChange(index, 'name', e.target.value)}
                                    className="w-1/3 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm"
                                    placeholder="Name"
                                />
                                <input
                                    type="text"
                                    value={social.url}
                                    onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                                    className="w-2/3 bg-gray-900 border border-gray-700 rounded p-2 text-white text-sm"
                                    placeholder="URL"
                                />
                            </div>
                        ))}
                    </div>
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
