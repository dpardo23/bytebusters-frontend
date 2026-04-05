export function useRoleAccess(userRole, allowedRoles = []) {
  return allowedRoles.includes(userRole)
}

export default useRoleAccess