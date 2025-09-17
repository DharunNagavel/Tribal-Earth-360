import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Home } from './pages/Home' 
import { About } from './pages/About'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Individual from './pages/Individual'
import Community from './pages/Community'
import CommunityResource from './pages/CommunityResource'
import Map from './pages/Map'
import { Digitalization } from './pages/Digitalization';
import { Auth } from './pages/Auth'

function AppContent() {
  const location = useLocation();

  // 👇 List of routes where you don't want the Navbar
  const hideNavbarRoutes = ["/map"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/individual' element={<Individual />} />
        <Route path='/community' element={<Community />} />
        <Route path='/resource' element={<CommunityResource />} />
        <Route path='/map' element={<Map />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/digitalization' element={<Digitalization />} />
      </Routes>
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
