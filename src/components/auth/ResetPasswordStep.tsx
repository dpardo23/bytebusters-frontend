import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'

interface ResetPasswordStepProps {
  email: string
  code: string
  newPassword: string
  error: string
  success: string
  isSubmitting: boolean
  onCodeChange: (value: string) => void
  onNewPasswordChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onBackToEmailStep: () => void
}

export default function ResetPasswordStep({
  email,
  code,
  newPassword,
  error,
  success,
  isSubmitting,
  onCodeChange,
  onNewPasswordChange,
  onSubmit,
  onBackToEmailStep,
}: ResetPasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Restablecer contrasena</h1>
        <p className='mt-2 text-muted-foreground'>Ingresa el codigo recibido y define una nueva contrasena.</p>
        <p className='mt-4 rounded-xl border border-border bg-muted px-3 py-2 text-sm text-foreground'>
          Email: <span className='font-medium'>{email}</span>
        </p>
      </div>

      <form className='mt-8 space-y-4' onSubmit={onSubmit}>
        <div>
          <label htmlFor='reset-code' className='mb-2 block text-sm font-medium text-foreground'>
            Codigo
          </label>
          <Input
            id='reset-code'
            placeholder='Ingresa el codigo'
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor='reset-password' className='mb-2 block text-sm font-medium text-foreground'>
            Nueva contrasena
          </label>
          <div className='relative'>
            <Input
              id='reset-password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Minimo 6 caracteres'
              value={newPassword}
              onChange={(event) => onNewPasswordChange(event.target.value)}
              className='pr-11'
              required
            />
            <button
              type='button'
              className='absolute right-1 top-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
        </div>

        {error ? (
          <p className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-destructive'>
            {error}
          </p>
        ) : null}

        {success ? (
          <p className='rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700'>
            {success}
          </p>
        ) : null}

        <Button type='submit' size='lg' className='w-full' disabled={isSubmitting}>
          {isSubmitting ? 'Actualizando...' : 'Restablecer contrasena'}
        </Button>
      </form>

      <button
        type='button'
        className='mt-6 text-sm font-medium text-primary transition-opacity hover:opacity-80'
        onClick={onBackToEmailStep}
      >
        Cambiar email
      </button>
    </>
  )
}
