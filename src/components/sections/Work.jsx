import React, { useState } from 'react';
import { useContentStore } from '../../store/contentStore';
import ProjectGallery from '../ui/ProjectGallery';

const Work = () => {
    const { projects } = useContentStore();
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <section id="work" className="relative w-full min-h-screen bg-black text-white py-20 px-4 md:px-10 flex flex-col z-10">
            {/* Header */}
            <div className="w-full flex justify-between items-end mb-20 border-b border-white/20 pb-4">
                <h2 className="text-6xl md:text-8xl font-bold tracking-tighter">WORK</h2>
                <span className="text-sm md:text-base font-light tracking-widest opacity-60">SELECTED PROJECTS (2023-2025)</span>
            </div>

            {/* Project List */}
            <div className="flex flex-col w-full">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className="group relative w-full py-10 border-b border-white/10 cursor-pointer flex justify-between items-center transition-colors hover:bg-white/5"
                    >
                        <h3 className="text-4xl md:text-6xl font-medium tracking-tight group-hover:translate-x-4 transition-transform duration-300">
                            {project.title}
                        </h3>
                        <span className="text-sm md:text-lg font-light opacity-50 group-hover:opacity-100 transition-opacity">
                            {project.category}
                        </span>
                    </div>
                ))}
            </div>

            {/* Full Screen Gallery */}
            <ProjectGallery
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};

export default Work;
