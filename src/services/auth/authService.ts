import type { AuthCredentials, AuthResult, AuthUser, RegisterAccountData } from '../../types/auth.types'

const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    email: 'ana.garcia@email.com',
    name: 'Ana Garcia',
    role: 'professional',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export async function login(credentials: AuthCredentials): Promise<AuthResult> {
  const foundUser = mockUsers.find(
    (user) => user.email.toLowerCase() === String(credentials.email || '').toLowerCase(),
  )

  if (!foundUser) {
    return { success: false, error: 'Usuario no encontrado' }
  }

  return {
    success: true,
    user: foundUser,
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

export async function logout(): Promise<AuthResult> {
  return { success: true }
}