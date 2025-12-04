import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContentStore } from '../../store/contentStore'

export default function Services() {
    const { services } = useContentStore()
    const [activeService, setActiveService] = useState(null)

    return (
        <section className="min-h-screen w-full py-20 px-4 md:px-10 relative z-10 bg-void-black text-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-sm font-mono text-gray-500 mb-20">OUR CAPABILITIES</h2>

                <div className="border-t border-white/20">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="border-b border-white/20 py-10 cursor-pointer group"
                            onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-4xl md:text-6xl font-bold group-hover:text-electric-blue transition-colors">
                                    {service.title}
                                </h3>
                                <span className="text-2xl">{activeService === service.id ? '-' : '+'}</span>
                            </div>

                            <AnimatePresence>
                                {activeService === service.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pt-8 text-xl font-mono text-gray-400 max-w-2xl">
                                            {service.description}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
