const mockUsers = [
  {
    id: 'user-1',
    email: 'ana.garcia@email.com',
    name: 'Ana Garcia',
    role: 'professional',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

export async function login(credentials) {
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

export async function registerAccount(data) {
  const normalizedEmail = String(data.email || '').trim().toLowerCase()
  const existingUser = mockUsers.find((user) => user.email.toLowerCase() === normalizedEmail)

  if (existingUser) {
    return { success: false, error: 'El email ya esta registrado' }
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    name: data.name,
    role: data.role,
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return { success: true, user: newUser }
}

export async function logout() {
  return { success: true }
}