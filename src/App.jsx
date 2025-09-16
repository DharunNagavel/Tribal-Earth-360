import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {Home} from './pages/Home'; 
import Map from './pages/Map'
import {Login} from './components/Login';
import { Signup } from './components/Signup';
import { Digitalization } from './pages/Digitalization';
import { Loginform } from './pages/Loginform';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/map' element={<Map />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/loginform' element={<Loginform />} />
      <Route path='/digitalization' element={<Digitalization />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
