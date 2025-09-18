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
import Final from './pages/Final'
import { useState } from 'react'

function AppContent() {
  const [user,setuser] = useState(false);
  const location = useLocation();
  const hideNavbarFooterRoutes = ["/auth", "/map"]; 
  const shouldHideNavbarFooter = hideNavbarFooterRoutes.includes(location.pathname);
 

  return (
    <>
      {!shouldHideNavbarFooter && <Navbar user={user} setuser={setuser} />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/individual' element={<Individual />} />
        <Route path='/community' element={<Community />} />
        <Route path='/resource' element={<CommunityResource />} />
        <Route path='/map' element={<Map />} />
        <Route path='/auth' element={<Auth setuser={setuser} />} />
        <Route path='/digitalization' element={<Digitalization />} />
        <Route path='/final' element={<Final />} />
      </Routes>
      {!shouldHideNavbarFooter && <Footer />}
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