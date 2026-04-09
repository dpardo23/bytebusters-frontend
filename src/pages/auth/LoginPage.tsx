import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-muted/30 py-10'>
      <LoginForm />
      <p className='fixed bottom-4 px-4 text-center text-sm text-muted-foreground'>
        Accede a tu cuenta para continuar con tu perfil y tus postulaciones.
      </p>
    </section>
  )
}
