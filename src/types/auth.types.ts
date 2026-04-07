export const AUTH_STATUS = {
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
} as const

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]

export type AuthRole = 'professional' | 'recruiter' | 'admin'

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

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  code: string
  newPassword: string
}

export type AuthResult =
  | {
      success: true
      user: AuthUser
      token?: string | null
    }
  | {
      success: false
      error: string
    }

export type AuthActionResult =
  | {
      success: true
      message: string
    }
  | {
      success: false
      error: string
    }
