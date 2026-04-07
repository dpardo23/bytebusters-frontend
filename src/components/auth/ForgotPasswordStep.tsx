import Button from '../ui/Button'
import Input from '../ui/Input'

interface ForgotPasswordStepProps {
  email: string
  error: string
  success: string
  isSubmitting: boolean
  onEmailChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onBackToLogin: () => void
}

export default function ForgotPasswordStep({
  email,
  error,
  success,
  isSubmitting,
  onEmailChange,
  onSubmit,
  onBackToLogin,
}: ForgotPasswordStepProps) {
  return (
    <>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Recuperar contrasena</h1>
        <p className='mt-2 text-muted-foreground'>Ingresa tu email y te enviaremos un codigo para continuar.</p>
      </div>

      <form className='mt-8 space-y-4' onSubmit={onSubmit}>
        <div>
          <label htmlFor='forgot-email' className='mb-2 block text-sm font-medium text-foreground'>
            Email
          </label>
          <Input
            id='forgot-email'
            type='email'
            autoComplete='email'
            placeholder='tu@email.com'
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
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
          {isSubmitting ? 'Enviando codigo...' : 'Enviar codigo'}
        </Button>
      </form>

      <button
        type='button'
        className='mt-6 text-sm font-medium text-primary transition-opacity hover:opacity-80'
        onClick={onBackToLogin}
      >
        Volver al login
      </button>
    </>
  )
}
