import { Link, Routes, Route } from 'react-router-dom'
import { useContentStore } from '../../store/contentStore'
import HeroEditor from './HeroEditor'
import WorkEditor from './WorkEditor'
import ServicesEditor from './ServicesEditor'
import VideosEditor from './VideosEditor'
import FooterEditor from './FooterEditor'

import { useEffect } from 'react'

export default function AdminLayout() {
    const store = useContentStore()

    useEffect(() => {
        store.fetchData()
    }, [])

    const handleDownload = () => {
        const data = {
            hero: store.hero,
            projects: store.projects,
            services: store.services,
            footer: store.footer
        }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'done-agency-config.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 p-6 fixed h-full overflow-y-auto flex flex-col">
                <h1 className="text-2xl font-bold mb-8 text-electric-blue">DONE. ADMIN</h1>
                <nav className="space-y-4 flex-1">
                    <Link to="/admin" className="block hover:text-electric-blue">Dashboard</Link>
                    <Link to="/admin/hero" className="block hover:text-electric-blue">Hero</Link>
                    <Link to="/admin/work" className="block hover:text-electric-blue">Work</Link>
                    <Link to="/admin/services" className="block hover:text-electric-blue">Services</Link>
                    <Link to="/admin/videos" className="block hover:text-electric-blue">Videos</Link>
                    <Link to="/admin/footer" className="block hover:text-electric-blue">Footer</Link>
                </nav>

                <div className="space-y-4 pt-8 border-t border-gray-800">
                    <button
                        onClick={handleDownload}
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-gray-300 transition-colors"
                    >
                        Download Config
                    </button>
                    <Link to="/" className="block text-sm text-gray-400 hover:text-white">← Back to Site</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 ml-64">
                <Routes>
                    <Route path="/" element={
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
                            <p className="text-gray-400">Select a section from the sidebar to edit content.</p>
                            <div className="mt-8 p-4 bg-gray-800 rounded border border-gray-700">
                                <h3 className="font-bold mb-2">⚡ Live Editing</h3>
                                <p className="text-sm text-gray-400">
                                    Changes made here are saved directly to the code (if the backend server is running).
                                    <br />
                                    <span className="text-xs opacity-50">Make sure 'node server.js' is running in the terminal.</span>
                                </p>
                            </div>
                        </div>
                    } />
                    <Route path="/hero" element={<HeroEditor />} />
                    <Route path="/work" element={<WorkEditor />} />
                    <Route path="/services" element={<ServicesEditor />} />
                    <Route path="/videos" element={<VideosEditor />} />
                    <Route path="/footer" element={<FooterEditor />} />
                </Routes>
            </main>
        </div>
    )
}
