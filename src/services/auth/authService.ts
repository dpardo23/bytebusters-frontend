import type { AuthCredentials, AuthResult, AuthUser, RegisterAccountData } from '../../types/auth.types'
import { AUTH_TOKEN_STORAGE_KEY } from '../../store/auth/authStore'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

type BackendApiResponse<T> = {
  success: boolean
  status: number
  message: string
  data?: T
  errors?: string[]
}

type BackendAuthUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  userType: 'INVITADO' | 'ESTANDAR' | 'RECLUTADOR' | 'ADMINISTRADOR'
}

type BackendAuthPayload = {
  action: string
  token: string
  tokenType: string
  expiresIn: number
  user: BackendAuthUser
}

type PasswordRecoveryMessage = {
  message?: string
}

function mapRole(userType: BackendAuthUser['userType']): AuthUser['role'] {
  switch (userType) {
    case 'RECLUTADOR':
      return 'recruiter'
    case 'ADMINISTRADOR':
      return 'admin'
    case 'ESTANDAR':
      return 'basic'
    default:
      return 'basic'
  }
}

function mapAuthUser(user: BackendAuthUser): AuthUser {
  return {
    id: String(user.id),
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    role: mapRole(user.userType),
    createdAt: new Date().toISOString(),
  }
}

function splitName(name: string): { firstName: string; lastName: string } {
  const normalized = String(name || '').trim().replace(/\s+/g, ' ')
  const [firstName = '', ...rest] = normalized.split(' ')
  return {
    firstName: firstName || 'Usuario',
    lastName: rest.join(' ') || 'DevFolio',
  }
}

function buildUsername(email: string): string {
  const [localPart = 'user', domainPart = 'mail'] = String(email || '').toLowerCase().split('@')
  const baseLocal = localPart.replace(/[^a-z0-9._-]/g, '') || 'user'
  const baseDomain = domainPart.split('.')[0]?.replace(/[^a-z0-9]/g, '') || 'mail'
  const suffix = Date.now().toString(36).slice(-4)
  const candidate = `${baseLocal}.${baseDomain}.${suffix}`
  return candidate.slice(0, 50)
}

function resolveErrorMessage(payload: { message?: string; errors?: string[] }, fallback: string): string {
  if (payload.errors && payload.errors.length > 0) {
    return payload.errors[0]
  }
  return payload.message || fallback
}

export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: credentials.email,
        password: credentials.password,
      }),
    })

    const payload = (await response.json()) as BackendApiResponse<BackendAuthPayload>
    if (!response.ok || !payload.success || !payload.data) {
      return { success: false, error: resolveErrorMessage(payload, 'No se pudo iniciar sesion') }
    }

    return {
      success: true,
      user: mapAuthUser(payload.data.user),
      token: payload.data.token,
    }
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' }
  }
}

export async function registerAccount(data: RegisterAccountData): Promise<AuthResult> {
  const normalizedEmail = String(data.email || '').trim().toLowerCase()
  const { firstName, lastName } = splitName(data.name)

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: buildUsername(normalizedEmail),
        email: normalizedEmail,
        firstName,
        lastName,
        password: data.password,
        userType: 'ESTANDAR',
      }),
    })

    const payload = (await response.json()) as BackendApiResponse<BackendAuthPayload>
    if (!response.ok || !payload.success || !payload.data) {
      return { success: false, error: resolveErrorMessage(payload, 'No se pudo crear la cuenta') }
    }

    return {
      success: true,
      user: mapAuthUser(payload.data.user),
      token: payload.data.token,
    }
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' }
  }
}

export async function selectUserType(userType: 'ESTANDAR' | 'RECLUTADOR'): Promise<AuthResult> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (!token) {
    return { success: false, error: 'Tu sesion expiro. Inicia sesion nuevamente.' }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/select-user-type`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userType }),
    })

    const payload = (await response.json()) as BackendApiResponse<BackendAuthPayload>
    if (!response.ok || !payload.success || !payload.data) {
      return { success: false, error: resolveErrorMessage(payload, 'No se pudo actualizar el tipo de cuenta') }
    }

    return {
      success: true,
      user: mapAuthUser(payload.data.user),
      token: payload.data.token,
    }
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' }
  }
}

export async function logout(): Promise<AuthResult> {
  const token = localStorage.getItem('devfolio-token')

  if (!token) {
    return { success: true }
  }

  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch {
    // If backend is unavailable, frontend still proceeds with local logout.
  }

  localStorage.removeItem('devfolio-token')
  return { success: true }
}

export async function requestPasswordResetCode(
  email: string,
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/password-recovery/request-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const payload = (await response.json()) as BackendApiResponse<PasswordRecoveryMessage>
    if (!response.ok || !payload.success) {
      return { success: false, error: resolveErrorMessage(payload, 'No se pudo enviar el codigo') }
    }

    return {
      success: true,
      message: payload.message || payload.data?.message || 'Codigo enviado correctamente',
    }
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' }
  }
}

export async function resetPasswordWithCode({
  email,
  code,
  newPassword,
}: {
  email: string
  code: string
  newPassword: string
}): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/password-recovery/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code,
        newPassword,
      }),
    })

    const payload = (await response.json()) as BackendApiResponse<PasswordRecoveryMessage>
    if (!response.ok || !payload.success) {
      return { success: false, error: resolveErrorMessage(payload, 'No se pudo restablecer la contrasena') }
    }

    return {
      success: true,
      message: payload.message || payload.data?.message || 'Contrasena actualizada correctamente',
    }
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor' }
  }
}
