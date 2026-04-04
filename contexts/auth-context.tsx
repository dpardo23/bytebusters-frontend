"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { mockUsers, type User, type UserRole } from '@/lib/mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  switchRole: (role: UserRole) => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('devfolio-user')
    if (stored) {
      try {
        setUser(JSON.parse(stored) as User)
      } catch {
        localStorage.removeItem('devfolio-user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const foundUser = mockUsers.find((currentUser) => currentUser.email.toLowerCase() === email.toLowerCase())

    if (!foundUser) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Contrasena incorrecta' }
    }

    setUser(foundUser)
    localStorage.setItem('devfolio-user', JSON.stringify(foundUser))
    return { success: true }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const exists = mockUsers.find((currentUser) => currentUser.email.toLowerCase() === data.email.toLowerCase())

    if (exists) {
      return { success: false, error: 'El email ya esta registrado' }
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      plan: 'free',
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      createdAt: new Date().toISOString(),
      isPublic: false,
      isVerified: false,
    }

    setUser(newUser)
    localStorage.setItem('devfolio-user', JSON.stringify(newUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('devfolio-user')
  }

  const switchRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem('devfolio-user', JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, switchRole }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}