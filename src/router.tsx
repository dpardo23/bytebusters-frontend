import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import ProfessionalRegisterPage from './pages/auth/ProfessionalRegisterPage'
import RecruiterRegisterPage from './pages/auth/RecruiterRegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ProfilePage from './pages/profile/ProfilePage'
import PublicProfilePage from './pages/profile/PublicProfilePage'

export const routes = [
  { path: '/', name: 'landing' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/register/professional', name: 'professional-register' },
  { path: '/auth/register/recruiter', name: 'recruiter-register' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/profile', name: 'profile' },
  { path: '/profile/:id', name: 'public-profile' },
]

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/register/professional' element={<ProfessionalRegisterPage />} />
        <Route path='/auth/register/recruiter' element={<RecruiterRegisterPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/profile/:id' element={<PublicProfilePage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}