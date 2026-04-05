import RecruiterRegisterForm from '../../components/auth/RecruiterRegisterForm'

export default function RecruiterRegisterPage() {
  return (
    <section className='flex min-h-screen items-center justify-center bg-muted/30 py-10'>
      <RecruiterRegisterForm />
      <p className='fixed bottom-4 px-4 text-center text-sm text-muted-foreground'>
        Al crear una cuenta, aceptas nuestros Terminos de Servicio y Politica de Privacidad.
      </p>
    </section>
  )
}