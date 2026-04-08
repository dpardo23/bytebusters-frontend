export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
} as const

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]

export type AuthRole = 'basic' | 'professional' | 'recruiter' | 'admin'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: AuthRole
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: AuthUser | null
  token: string | null
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterAccountData extends AuthCredentials {
  name: string
  role?: AuthRole
}

export type AuthResult =
  | {
      success: true
      user?: AuthUser
      token?: string
    }
  | {
      success: false
      error: string
    }
