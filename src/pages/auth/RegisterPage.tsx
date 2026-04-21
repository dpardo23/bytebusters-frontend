import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Button, Input } from '@/components/shared';
import {
  AuthFooterLink,
  AuthHero,
  AuthRoleSelector,
  SocialAuthGroup,
} from '@/components/auth/AuthShared';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('professional');
  const [fullName, setFullName] = useState('Ada Lovelace');
  const [email, setEmail] = useState('ada@ethoshub.com');
  const [password, setPassword] = useState('demo123');
  const [confirmPassword, setConfirmPassword] = useState('demo123');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login', {
      replace: false,
      state: {
        prefills: {
          email,
          password,
          role: selectedRole,
          fromRegister: true,
          fullName,
        },
      },
    });
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </div>

      <AuthHero
        eyebrow="Nuevo acceso"
        title="Crea una cuenta demo y prepara tu perfil."
        description="Diseñamos una experiencia visual lista para Google y GitHub, pero manteniendo el flujo estático mientras aún no hay backend."
      />

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/82"
      >
        <div className="border-b border-slate-200/80 bg-[radial-gradient(circle_at_top,#eff6ff_0%,rgba(255,255,255,0)_58%)] px-5 py-6 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.2)_0%,rgba(2,6,23,0)_60%)] sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Registro estático</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Crear cuenta
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Puedes usar este formulario como onboarding visual mientras conectas tu backend más adelante.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary dark:border-primary/30 dark:bg-primary/15 sm:block">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <SocialAuthGroup
            googleLabel="Regístrate con Google"
            githubLabel="Regístrate con GitHub"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthRoleSelector selectedRole={selectedRole} onChange={setSelectedRole} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Nombre completo
                </label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 shadow-none focus-visible:ring-primary/30 dark:border-slate-700 dark:bg-slate-950/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Email
                </label>
                <Input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 shadow-none focus-visible:ring-primary/30 dark:border-slate-700 dark:bg-slate-950/50"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña"
                    className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 pr-12 shadow-none focus-visible:ring-primary/30 dark:border-slate-700 dark:bg-slate-950/50"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Confirmar contraseña
                </label>
                <Input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 px-4 shadow-none focus-visible:ring-primary/30 dark:border-slate-700 dark:bg-slate-950/50"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-900">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>
                Acepto los términos de uso y entiendo que este registro es solo demostrativo mientras no exista backend.
              </span>
            </label>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#2563eb_100%)] text-base font-semibold text-white shadow-[0_20px_45px_-24px_rgba(37,99,235,0.8)] transition-transform hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
            >
              Crear cuenta demo
            </Button>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Este formulario no crea usuarios reales. Al continuar, te llevaremos al login con tus datos precargados para simular el acceso.
            </div>
          </form>

          <AuthFooterLink prompt="¿Ya tienes cuenta?" cta="Inicia sesión" to="/login" />

          <p className="text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
            También puedes volver al acceso demo desde <Link to="/login" className="font-semibold text-primary hover:text-primary/80">Login</Link>.
          </p>
        </div>
      </motion.section>
    </div>
  );
}

