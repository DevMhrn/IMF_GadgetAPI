import { useState, useEffect } from 'react'
import { Navigate, Outlet, Routes, Route } from 'react-router-dom'
import { useStore } from './store'
import { setAuthToken } from './libs/apiCalls'
import { Toaster } from 'sonner'
import Login from './pages/login'
import Dashboard from './pages/Dashboard'

const ProtectedRoute = () => {
  const { user } = useStore(state => state)
  setAuthToken(user?.token || null)
  
  return user ? <Outlet /> : <Navigate to="/login" />  // Fixed: redirect to login if no user
}

const PublicRoute = () => {
  const { user } = useStore(state => state)
  
  return !user ? <Outlet /> : <Navigate to="/dashboard" />  // Fixed: redirect to dashboard if user exists
}

function App() {
  const { theme } = useStore((state) => state);

  

  return (
    <>
      <Toaster position="top-right" richColors />
      <main>
        <div className='w-full min-h-screen  bg-gray-100  dark:bg-gray-800'>
          <Routes>
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
