import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Hero from './components/sections/Hero'
import Work from './components/sections/Work'
import Services from './components/sections/Services'
import VideoShowcase from './components/sections/VideoShowcase'
import Footer from './components/sections/Footer'
import AdminLayout from './components/admin/AdminLayout'

import { useEffect } from 'react'
import { useContentStore } from './store/contentStore'

function MainSite() {
  const { fetchData } = useContentStore()

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Layout>
      <Hero />
      <VideoShowcase />
      <Work />
      <Services />
      <Footer />
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </Router>
  )
}

export default App
