import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-muted/30 py-10'>
      <Link
        to='/'
        className='fixed left-4 top-4 inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent'
      >
        <ChevronLeft className='h-4 w-4' />
        Volver al inicio
      </Link>
      <LoginForm />
      <p className='fixed bottom-4 px-4 text-center text-sm text-muted-foreground'>
        Accede a tu cuenta para continuar con tu perfil y tus postulaciones.
      </p>
    </section>
  )
}
