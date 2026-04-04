"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/contexts/auth-context'
import { Code2, Github, Linkedin, Loader2, Eye, EyeOff, Briefcase, Users } from 'lucide-react'
import type { UserRole } from '@/lib/mock-data'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('professional')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setIsLoading(true)
    const result = await register({ email, password, name, role })

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Error al crear la cuenta')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span>DevFolio</span>
          </Link>
          <p className="text-muted-foreground">Crea tu cuenta gratuita</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>Completa el formulario para comenzar a crear tu portafolio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>Tipo de cuenta</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                    <Label
                      htmlFor="professional"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                    >
                      <Briefcase className="w-6 h-6 mb-2" />
                      <span className="font-medium">Profesional</span>
                      <span className="text-xs text-muted-foreground">Crear portafolio</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="recruiter" id="recruiter" className="peer sr-only" />
                    <Label
                      htmlFor="recruiter"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                    >
                      <Users className="w-6 h-6 mb-2" />
                      <span className="font-medium">Reclutador</span>
                      <span className="text-xs text-muted-foreground">Buscar talento</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" type="text" placeholder="Tu nombre" value={name} onChange={(event) => setName(event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimo 6 caracteres"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contrasena</Label>
                <Input id="confirmPassword" type="password" placeholder="Repite la contrasena" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">O registrate con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" type="button">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Iniciar sesion
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Al crear una cuenta, aceptas nuestros{' '}
          <Link href="#" className="text-primary hover:underline">
            Terminos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="#" className="text-primary hover:underline">
            Politica de Privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}