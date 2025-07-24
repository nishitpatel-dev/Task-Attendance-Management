import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Login from './components/auth/Login'
import EmployeeDashboard from './components/auth/EmployeeDashboard'
import SuperiorDashboard from './components/auth/SuperiorDashboard'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/employee' element={<EmployeeDashboard />} />
          <Route path='/superior' element={<SuperiorDashboard />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  )
}

export default App