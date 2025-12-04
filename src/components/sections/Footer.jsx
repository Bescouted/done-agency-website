import { useContentStore } from '../../store/contentStore'
import { Link } from 'react-router-dom'

export default function Footer() {
    const { footer } = useContentStore()

    return (
        <footer className="w-full py-20 px-4 md:px-10 bg-void-black text-white relative z-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div>
                    <img
                        src="/Logo/hero-logo.png"
                        alt="DONE Logo"
                        className="w-80 md:w-96 h-auto object-contain filter invert mb-4"
                    />
                    <p className="text-xl font-mono text-gray-400 mt-4">{footer.address}</p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4">
                    <a href={`mailto:${footer.email}`} className="text-2xl md:text-4xl font-bold hover:text-electric-blue transition-colors">
                        {footer.email}
                    </a>
                    <div className="flex gap-6">
                        {footer.socials.map((social) => (
                            <a key={social.name} href={social.url} className="font-mono text-gray-400 hover:text-white transition-colors">
                                {social.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
