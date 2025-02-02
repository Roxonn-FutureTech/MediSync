import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Hospitals from './components/Hospitals'
import Incidents from './components/Incidents'
import Transfers from './components/Transfers'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/hospitals"
                element={
                  <PrivateRoute>
                    <Hospitals />
                  </PrivateRoute>
                }
              />
              <Route
                path="/incidents"
                element={
                  <PrivateRoute>
                    <Incidents />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transfers"
                element={
                  <PrivateRoute>
                    <Transfers />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App