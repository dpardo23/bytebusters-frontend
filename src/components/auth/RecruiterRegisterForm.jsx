import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle, Network, Users, Webhook } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { isValidEmail, isValidPassword } from '../../lib/validations/authValidations'
import useAuth from '../../hooks/auth/useAuth'

export default function RecruiterRegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Ingresa un email valido')
      return
    }

    if (!isValidPassword(password)) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    setIsSubmitting(true)
    const result = await register({ name, email, password, role: 'recruiter' })

    if (result.success) {
      navigate('/dashboard')
      return
    }

    setError(result.error || 'No se pudo crear la cuenta')
    setIsSubmitting(false)
  }

  return (
    <div className='w-full max-w-2xl px-4'>
      <div className='mx-auto mb-8 max-w-xl text-center'>
        <Link to='/' className='mb-2 inline-flex items-center gap-2 text-4xl font-bold text-foreground'>
          <span className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
            <Users className='h-5 w-5' />
          </span>
          DevFolio
        </Link>
        <p className='text-lg text-muted-foreground'>Crea tu cuenta de reclutador</p>
      </div>

      <div className='rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8'>
        <h1 className='text-3xl font-bold text-foreground'>Crear Cuenta</h1>
        <p className='mt-2 text-muted-foreground'>Completa el formulario para comenzar a buscar talento.</p>

        <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='recruiter-role' className='mb-2 block text-sm font-medium text-foreground'>
              Tipo de cuenta
            </label>
            <div id='recruiter-role' className='flex h-24 w-full items-center justify-center rounded-xl border-2 border-primary bg-primary/5'>
              <div className='text-center'>
                <p className='font-semibold text-foreground'>Reclutador</p>
                <p className='text-sm text-muted-foreground'>Buscar talento</p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor='fullName' className='mb-2 block text-sm font-medium text-foreground'>
              Nombre completo
            </label>
            <Input
              id='fullName'
              placeholder='Tu nombre'
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor='email' className='mb-2 block text-sm font-medium text-foreground'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              placeholder='tu@email.com'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='mb-2 block text-sm font-medium text-foreground'>
              Contrasena
            </label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Minimo 6 caracteres'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className='pr-11'
                required
              />
              <button
                type='button'
                className='absolute right-1 top-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor='confirmPassword' className='mb-2 block text-sm font-medium text-foreground'>
              Confirmar contrasena
            </label>
            <Input
              id='confirmPassword'
              type='password'
              placeholder='Repite la contrasena'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className='text-sm font-medium text-destructive'>{error}</p> : null}

          <Button type='submit' className='w-full' size='lg' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className='h-4 w-4 animate-spin' />
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </form>

        <div className='my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground'>
          <span className='h-px flex-1 bg-border' />
          <span>O registrate con</span>
          <span className='h-px flex-1 bg-border' />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <Button variant='outline' className='w-full'>
            <Webhook className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' className='w-full'>
            <Network className='h-4 w-4' /> LinkedIn
          </Button>
        </div>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Ya tienes cuenta?{' '}
          <Link to='/auth/login' className='font-semibold text-primary hover:underline'>
            Iniciar sesion
          </Link>
        </p>
      </div>
    </div>
  )
}