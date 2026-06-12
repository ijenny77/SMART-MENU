import React, { useEffect } from 'react'
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// ── Admin pages ──
import HomePage        from './components/pages/marketing/HomePage'
import SignUpPage      from './components/pages/auth/SignUpPage'
import LoginPage       from './components/pages/marketing/LoginPage'
import OperationsPage  from './components/pages/Operations/OperationsPage.jsx'
import MenusPage       from './components/pages/Operations/MenusPage.jsx'
import OrdersPage      from './components/pages/Operations/OrdersPage.jsx'
import ClientsListPage from './components/pages/clients/ClientsListPage.jsx'
import AddClientPage   from './components/pages/clients/AddClientPage.jsx'
import SettingsPage    from './components/pages/Settings/SettingsPage.jsx'
import OverviewPage    from './components/pages/Overview/OverviewPage.jsx'
import AccountPage     from './components/pages/Account/AccountPage.jsx'

// ── Onboarding ──
import Onboarding1 from './components/pages/Onboarding/Onboarding1'
import Onboarding2 from './components/pages/Onboarding/Onboarding2'
import Onboarding3 from './components/pages/Onboarding/Onboarding3'

// ── Client (customer) pages ──
import ClientRestaurantsPage from './components/pages/clients/ClientRestaurantsPage.jsx'
import ClientTablePage       from './components/pages/clients/ClientTablePage.jsx'
import ClientMenuPage        from './components/pages/clients/ClientMenuPage.jsx'
import ClientDashboard       from './components/pages/clients/ClientDashboard.jsx'
import ClientMyOrdersPage    from './components/pages/clients/ClientMyOrdersPage.jsx'
import ClientAccountPage     from './components/pages/clients/ClientAccountPage.jsx'
import ClientSettingsPage    from './components/pages/clients/ClientSettingsPage.jsx'

// ─────────────────────────────────────────────
// Route guards
// ─────────────────────────────────────────────

/* Redirect unauthenticated users to /login */
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" replace />
}

/* Only restaurant admins may enter — clients are sent to their dashboard */
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return user.role !== 'client'
    ? children
    : <Navigate to="/clientRestaurants" replace />
}

/* Only customers may enter — admins are sent to their dashboard */
const ClientRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'client'
    ? children
    : <Navigate to="/overview" replace />
}

// ─────────────────────────────────────────────
const publicPaths = ['/', '/login', '/SignUpPage']

const App = () => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  /* When a logged-in user lands on a public page, send them home */
  useEffect(() => {
    if (loading) return
    if (user && publicPaths.includes(location.pathname)) {
      const role = user.role
      if (role !== 'client' && localStorage.getItem('justRegistered') === 'true') {
        localStorage.removeItem('justRegistered')
        navigate('/onboarding', { replace: true })
      } else {
        navigate(role === 'client' ? '/clientRestaurants' : '/overview', { replace: true })
      }
    }
  }, [user, loading, location.pathname])

  return (
    <Routes>

      {/* ── Public ── */}
      <Route path='/'           element={<HomePage />} />
      <Route path='/SignUpPage' element={<SignUpPage />} />
      <Route path='/login'      element={<LoginPage />} />

      {/* ── Admin-only ── */}
      <Route path='/onboarding'  element={<AdminRoute><Onboarding1 /></AdminRoute>} />
      <Route path='/Onboarding2' element={<AdminRoute><Onboarding2 /></AdminRoute>} />
      <Route path='/Onboarding3' element={<AdminRoute><Onboarding3 /></AdminRoute>} />
      <Route path='/overview'        element={<AdminRoute><OverviewPage /></AdminRoute>} />
      <Route path='/OperationsPage'  element={<AdminRoute><OperationsPage /></AdminRoute>} />
      <Route path='/MenusPage'       element={<AdminRoute><MenusPage /></AdminRoute>} />
      <Route path='/OrdersPage'      element={<AdminRoute><OrdersPage /></AdminRoute>} />
      <Route path='/ClientsListPage' element={<AdminRoute><ClientsListPage /></AdminRoute>} />
      <Route path='/AddClientPage'   element={<AdminRoute><AddClientPage /></AdminRoute>} />
      <Route path='/settings'        element={<AdminRoute><SettingsPage /></AdminRoute>} />
      <Route path='/account'         element={<AdminRoute><AccountPage /></AdminRoute>} />

      {/* ── Client-only ── */}
      <Route path='/clientRestaurants' element={<ClientRoute><ClientRestaurantsPage /></ClientRoute>} />
      <Route path='/clientTable'       element={<ClientRoute><ClientTablePage /></ClientRoute>} />
      <Route path='/clientMenu'        element={<ClientRoute><ClientMenuPage /></ClientRoute>} />
      <Route path='/ClientDashboard'   element={<ClientRoute><ClientDashboard /></ClientRoute>} />
      <Route path='/clientOrders'      element={<ClientRoute><ClientMyOrdersPage /></ClientRoute>} />
      <Route path='/clientAccount'     element={<ClientRoute><ClientAccountPage /></ClientRoute>} />
      <Route path='/clientSettings'    element={<ClientRoute><ClientSettingsPage /></ClientRoute>} />

      {/* ── Fallback ── */}
      <Route path='*' element={<RequireAuth><Navigate to="/overview" replace /></RequireAuth>} />

    </Routes>
  )
}

export default App
