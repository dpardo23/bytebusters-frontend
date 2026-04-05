export const ROLES = {
  PROFESSIONAL: 'professional',
  RECRUITER: 'recruiter',
  ADMIN: 'admin',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export default ROLES