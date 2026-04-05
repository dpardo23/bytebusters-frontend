export const routes = [
  { path: '/', name: 'landing' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/register/professional', name: 'professional-register' },
  { path: '/auth/register/recruiter', name: 'recruiter-register' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/profile', name: 'profile' },
  { path: '/profile/:id', name: 'public-profile' },
]

export default routes