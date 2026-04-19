import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button, Input } from '@/shared/ui';
import {
  AuthFooterLink,
  AuthHero,
  SocialAuthGroup,
} from '@/components/auth/AuthShared';

type RegisterPrefills = {
  email?: string;
  password?: string;
  role?: 'professional' | 'recruiter' | 'admin' | 'guest';
  fromRegister?: boolean;
  fullName?: string;
};

type MockLoginAccount = {
  label: string;
  role: 'professional' | 'recruiter' | 'admin' | 'guest';
  email: string;
  password: string;
};

const MOCK_LOGIN_ACCOUNTS: MockLoginAccount[] = [
  {
    label: 'Profesional - Carlos Mendoza',
    role: 'professional',
    email: 'carlos.dev@email.com',
    password: 'mock123',
  },
  {
    label: 'Reclutador - Ana Garcia',
    role: 'recruiter',
    email: 'ana.recruiter@company.com',
    password: 'mock123',
  },
  {
    label: 'Admin - EthosHub',
    role: 'admin',
    email: 'admin@ethoshub.com',
    password: 'mock123',
  },
  {
    label: 'Invitado - Explore',
    role: 'guest',
    email: 'guest@ethoshub.com',
    password: 'mock123',
  },
];

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const prefills = (location.state as { prefills?: RegisterPrefills } | null)?.prefills;

  const [email, setEmail] = useState(MOCK_LOGIN_ACCOUNTS[0].email);
  const [password, setPassword] = useState(MOCK_LOGIN_ACCOUNTS[0].password);
  const [selectedRole, setSelectedRole] = useState<'professional' | 'recruiter' | 'admin' | 'guest'>(
    MOCK_LOGIN_ACCOUNTS[0].role,
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!prefills) {
      return;
    }

    if (prefills.email) {
      setEmail(prefills.email);
    }
    if (prefills.password) {
      setPassword(prefills.password);
    }
    if (prefills.role) {
      setSelectedRole(prefills.role);
    }
  }, [prefills]);

  const applyMockAccount = (account: MockLoginAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setSelectedRole(account.role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const role = prefills?.role ?? selectedRole;
    await login(email, password, role);

    if (role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    if (role === 'guest') {
      navigate('/explorar');
      return;
    }

    navigate('/dashboard');
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
        eyebrow="Bienvenido de vuelta"
        title="Inicia sesión y continúa construyendo tu presencia profesional."
        description="Mantuvimos el acceso estático para que puedas probar la experiencia completa del frontend sin depender todavía de un backend de autenticación."
      />

      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/82"
      >
        <div className="border-b border-slate-200/80 bg-[radial-gradient(circle_at_top,#eef2ff_0%,rgba(255,255,255,0)_58%)] px-5 py-6 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top,rgba(99,91,255,0.18)_0%,rgba(2,6,23,0)_60%)] sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Acceso demo</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                Iniciar sesión
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Usa una cuenta mock predefinida para entrar en segundos o escribe tus propios datos.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary dark:border-primary/30 dark:bg-primary/15 sm:block">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Email
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500">Persistente en navegador</span>
                </div>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-11 pr-4 shadow-none focus-visible:ring-primary/30 dark:border-slate-700 dark:bg-slate-950/50"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Contraseña
                  </label>
                  <Link
                    to="/register"
                    className="text-xs font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    ¿Aún no tienes cuenta?
                  </Link>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-11 pr-12 shadow-none focus-visible:ring-primary/30 dark:border-slate-700 dark:bg-slate-950/50"
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
            </div>

            {prefills?.fromRegister && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
                Cuenta demo preparada{prefills.fullName ? ` para ${prefills.fullName}` : ''}. Tus datos quedaron precargados para continuar sin backend.
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#635bff_0%,#4f46e5_100%)] text-base font-semibold text-white shadow-[0_20px_45px_-24px_rgba(79,70,229,0.9)] transition-transform hover:scale-[1.01] hover:opacity-95 active:scale-[0.99]"
            >
              Iniciar sesión
            </Button>

            <div className="my-2 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span>O continua con</span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <SocialAuthGroup
              googleLabel="Continuar con Google"
              githubLabel="Continuar con GitHub"
            />

            <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-slate-100">Cuentas mock predefinidas</p>
              {MOCK_LOGIN_ACCOUNTS.map((account) => (
                <button
                  key={`${account.role}-${account.email}`}
                  type="button"
                  onClick={() => applyMockAccount(account)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950/50 dark:hover:bg-slate-900"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-200">{account.label}</span>
                  <span className="text-slate-500 dark:text-slate-400">{account.email}</span>
                </button>
              ))}
              <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">Contraseña sugerida para mock: mock123</p>
            </div>
          </form>

          <AuthFooterLink prompt="¿No tienes cuenta?" cta="Crear cuenta" to="/register" />

          <p className="text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
            El acceso social mostrado arriba es solo visual. La sesión real sigue siendo estática y local para esta demo.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
