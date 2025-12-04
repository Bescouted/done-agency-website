import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Hero from './components/sections/Hero'
import Work from './components/sections/Work'
import Services from './components/sections/Services'
import VideoShowcase from './components/sections/VideoShowcase'
import Footer from './components/sections/Footer'
import AdminLayout from './components/admin/AdminLayout'
import Login from './components/auth/Login'
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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
