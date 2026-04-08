import type { Role } from '../lib/constants/roles'

export function useRoleAccess(userRole: Role | null | undefined, allowedRoles: Role[] = []): boolean {
  return Boolean(userRole && allowedRoles.includes(userRole))
}

export default useRoleAccess