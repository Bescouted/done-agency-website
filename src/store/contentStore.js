import { create } from 'zustand'
import { projects as initialProjects } from '../data/projects'
import { services as initialServices } from '../data/services'
import { footer as initialFooter } from '../data/footer'
import { videos as initialVideos } from '../data/videos'

export const useContentStore = create((set) => ({
    // Hero Section
    hero: {
        title: "WE ARE DONE.",
        subtitle: "WE FIX BORING ADS"
    },
    setHero: (hero) => set((state) => ({ hero: { ...state.hero, ...hero } })),

    // Work Section
    projects: initialProjects,
    setProjects: (projects) => set({ projects }),
    addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
    removeProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),
    updateProject: (id, updatedProject) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updatedProject } : p)
    })),

    // Services Section
    services: initialServices,
    setServices: (services) => set({ services }),
    addService: (service) => set((state) => ({ services: [...state.services, service] })),
    removeService: (id) => set((state) => ({ services: state.services.filter(s => s.id !== id) })),
    updateService: (id, updatedService) => set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, ...updatedService } : s)
    })),

    // Footer Section
    footer: initialFooter,
    setFooter: (footer) => set((state) => ({ footer: { ...state.footer, ...footer } })),

    // Video Section
    videos: initialVideos,
    setVideos: (videos) => set({ videos }),
    addVideo: (video) => set((state) => ({ videos: [...state.videos, video] })),
    removeVideo: (id) => set((state) => ({ videos: state.videos.filter(v => v.id !== id) })),
    updateVideo: (id, updatedVideo) => set((state) => ({
        videos: state.videos.map(v => v.id === id ? { ...v, ...updatedVideo } : v)
    })),

    // Initialization
    fetchData: async () => {
        try {
            const [projectsRes, servicesRes, footerRes, videosRes] = await Promise.all([
                fetch('/api/projects'),
                fetch('/api/services'),
                fetch('/api/footer'),
                fetch('/api/videos')
            ]);

            if (projectsRes.ok) {
                const data = await projectsRes.json();
                if (data && data.length > 0) set({ projects: data });
            }
            if (servicesRes.ok) {
                const data = await servicesRes.json();
                if (data && data.length > 0) set({ services: data });
            }
            if (footerRes.ok) {
                const data = await footerRes.json();
                if (data && Object.keys(data).length > 0) set({ footer: data });
            }
            if (videosRes.ok) {
                const data = await videosRes.json();
                if (data && data.length > 0) set({ videos: data });
            }
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    }
}))

