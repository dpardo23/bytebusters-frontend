import type {
  AuthActionResult,
  AuthCredentials,
  AuthResult,
  AuthUser,
  ForgotPasswordPayload,
  RegisterAccountData,
  ResetPasswordPayload,
} from '../../types/auth.types'
import httpClient, { HttpClientError } from '../../lib/api/httpClient'

const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    email: 'ana.garcia@email.com',
    name: 'Ana Garcia',
    role: 'professional',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

const API_BASE_URL = 'http://localhost:8080/api'

type ApiObject = Record<string, unknown>

function isObject(value: unknown): value is ApiObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function pickString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

function normalizeRole(value: unknown): AuthUser['role'] {
  if (Array.isArray(value)) {
    const normalizedArray = value.map((item) => String(item).toLowerCase())
    if (normalizedArray.some((item) => item.includes('admin'))) return 'admin'
    if (normalizedArray.some((item) => item.includes('recruit'))) return 'recruiter'
    return 'professional'
  }

  const normalizedValue = String(value || '').toLowerCase()

  if (normalizedValue.includes('admin')) return 'admin'
  if (normalizedValue.includes('recruit')) return 'recruiter'
  return 'professional'
}

function getResponseNodes(payload: unknown) {
  const root = isObject(payload) ? payload : {}
  const data = isObject(root.data) ? root.data : {}
  const user = isObject(root.user) ? root.user : isObject(data.user) ? data.user : {}
  return { root, data, user }
}

function mapLoginUser(payload: unknown, usernameOrEmail: string): AuthUser {
  const { root, data, user } = getResponseNodes(payload)
  const fallbackName = usernameOrEmail.includes('@') ? usernameOrEmail.split('@')[0] : usernameOrEmail
  const email =
    pickString(user.email, data.email, root.email, user.username, data.username, root.username, usernameOrEmail) ||
    usernameOrEmail
  const name =
    pickString(user.name, user.fullName, data.name, data.fullName, root.name, root.fullName, user.username, data.username, root.username) ||
    fallbackName
  const id =
    pickString(user.id, data.id, root.id, user.userId, data.userId, root.userId, user.sub, data.sub, root.sub) ||
    email
  const avatar = pickString(user.avatar, data.avatar, root.avatar, user.profilePicture, data.profilePicture, root.profilePicture) || undefined
  const createdAt = pickString(user.createdAt, data.createdAt, root.createdAt) || new Date().toISOString()
  const role = normalizeRole(user.roles || data.roles || root.roles || user.role || data.role || root.role)

  return {
    id,
    email,
    name,
    role,
    avatar,
    createdAt,
  }
}

function extractToken(payload: unknown): string | null {
  const { root, data, user } = getResponseNodes(payload)

  return (
    pickString(
      root.token,
      root.accessToken,
      root.jwt,
      root.jwtToken,
      data.token,
      data.accessToken,
      data.jwt,
      data.jwtToken,
      user.token,
      user.accessToken,
    ) || null
  )
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpClientError) {
    return error.message || fallback
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  try {
    const payload = await httpClient<unknown>(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: credentials.email,
        password: credentials.password,
      }),
    })

    return {
      success: true,
      user: mapLoginUser(payload, credentials.email),
      token: extractToken(payload),
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'No se pudo iniciar sesion'),
    }
  }
}

export async function registerAccount(data: RegisterAccountData): Promise<AuthResult> {
  const normalizedEmail = String(data.email || '').trim().toLowerCase()
  const existingUser = mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail)

  if (existingUser) {
    return { success: false, error: 'El email ya esta registrado' }
  }

  const newUser: AuthUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    name: data.name,
    role: data.role || 'professional',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || normalizedEmail)}`,
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return { success: true, user: newUser }
}

export async function logout(): Promise<void> {
  return undefined
}

export async function requestPasswordResetCode(data: ForgotPasswordPayload): Promise<AuthActionResult> {
  try {
    const payload = await httpClient<unknown>(`${API_BASE_URL}/auth/password-recovery/request-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
      }),
    })

    const { root, data: responseData } = getResponseNodes(payload)

    return {
      success: true,
      message:
        pickString(root.message, responseData.message) ||
        'Codigo enviado correctamente. Continua con el siguiente paso.',
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'No se pudo enviar el codigo'),
    }
  }
}

export async function resetPassword(data: ResetPasswordPayload): Promise<AuthActionResult> {
  try {
    const payload = await httpClient<unknown>(`${API_BASE_URL}/auth/password-recovery/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      }),
    })

    const { root, data: responseData } = getResponseNodes(payload)

    return {
      success: true,
      message:
        pickString(root.message, responseData.message) ||
        'Contrasena actualizada correctamente. Redirigiendo al login.',
    }
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error, 'No se pudo restablecer la contrasena'),
    }
  }
}
