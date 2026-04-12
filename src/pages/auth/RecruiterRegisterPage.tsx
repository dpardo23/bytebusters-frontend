import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import RecruiterRegisterForm from '../../components/auth/RecruiterRegisterForm'

export default function RecruiterRegisterPage() {
  return (
    <section className='flex min-h-screen flex-col items-center justify-center bg-muted/30 py-10'>
      <Link
        to='/'
        className='fixed left-4 top-4 inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent'
      >
        <ChevronLeft className='h-4 w-4' />
        Volver al Inicio
      </Link>
      <RecruiterRegisterForm />
      <p className='mt-6 px-4 text-center text-sm text-muted-foreground'>
        Al crear una cuenta, aceptas nuestros Terminos de Servicio y Politica de Privacidad.
      </p>
    </section>
  )
}