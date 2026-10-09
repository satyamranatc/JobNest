import React from 'react'

import { BrowserRouter,Routes,Route } from 'react-router-dom'

import NavBar from './components/NavBar.jsx'
import SideBar from './components/SideBar.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Auth from './pages/Auth.jsx'



export default function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar/>
        <SideBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/auth" element={<Auth/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
