import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import NavBar from './components/NavBar.jsx'
import SideBar from './components/SideBar.jsx'
import Footer from './components/Footer.jsx'

import PrivateRoute from './components/PrivateRoute.jsx'

import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Jobs from './pages/Jobs.jsx'
import JobApply from './pages/JobApply.jsx'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs/>} />
          <Route path="/applyForJob" element={<PrivateRoute> <JobApply /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute> <Profile /></PrivateRoute>} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
