import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home' 
import { About } from './pages/About'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Individual from './pages/Individual'
import Community from './pages/Community'
import CommunityResource from './pages/CommunityResource'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/individual' element={<Individual />}></Route>
        <Route path='/community' element={<Community />}></Route>
        <Route path='/resource' element={<CommunityResource />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

