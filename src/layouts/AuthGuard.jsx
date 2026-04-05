export default function AuthGuard({ isAuthenticated, children, fallback = null }) {
  return isAuthenticated ? children : fallback
}