import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home' 
import { About } from './pages/About'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Individual from './pages/Individual'
import Community from './pages/Community'
import CommunityResource from './pages/CommunityResource'
import Map from './pages/Map'
import {Login} from './components/Login';
import { Signup } from './components/Signup';
import { Digitalization } from './pages/Digitalization';
import { Loginform } from './pages/Loginform';

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
        <Route path='/map' element={<Map />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/loginform' element={<Loginform />} />
      <Route path='/digitalization' element={<Digitalization />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App

