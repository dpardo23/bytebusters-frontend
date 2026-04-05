export default function RoleGuard({ userRole, allowedRoles = [], children, fallback = null }) {
  return allowedRoles.includes(userRole) ? children : fallback
}