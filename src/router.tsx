import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/profile/ProfilePage'
import PublicProfilePage from './pages/profile/PublicProfilePage'
import UserAccountPage from './pages/user/UserAccountPage'

export const routes = [
  { path: '/', name: 'landing' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/register', name: 'register' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/profile', name: 'profile' },
  { path: '/profile/:id', name: 'public-profile' },
  { path: '/user/:id', name: 'user-account' },
]

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
        <Route path='/auth/register/professional' element={<Navigate to='/auth/register' replace />} />
        <Route path='/auth/register/recruiter' element={<Navigate to='/auth/register' replace />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/profile/:id' element={<PublicProfilePage />} />
        <Route path='/user/:id' element={<UserAccountPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
