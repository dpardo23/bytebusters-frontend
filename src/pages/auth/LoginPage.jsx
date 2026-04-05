import LoginForm from '../../components/auth/LoginForm'
import OAuthButtons from '../../components/auth/OAuthButtons'

export default function LoginPage() {
  return (
    <section>
      <LoginForm />
      <OAuthButtons />
    </section>
  )
}