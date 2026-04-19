import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Code2,
  GitBranch,
  Globe,
  Search,
  Sparkles,
  UserRoundSearch,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Badge } from '@/shared/ui';

const features = [
  {
    icon: GitBranch,
    title: 'Integración GitHub',
    description: 'Importa repositorios, stack y evidencia real para fortalecer tu portafolio.',
  },
  {
    icon: Briefcase,
    title: 'Integración LinkedIn',
    description: 'Sincroniza experiencia, formación y logros para ahorrar tiempo de carga.',
  },
  {
    icon: UserRoundSearch,
    title: 'Red de talento',
    description: 'Conecta con profesionales y reclutadores desde una sola plataforma.',
  },
];

const highlights = [
  '+1,200 profesionales',
  'Integración GitHub',
  'Integración LinkedIn',
];

export default function HomePage() {
  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,91,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.10),transparent_24%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              La plataforma para desarrolladores
            </div>

            <h1 className="mt-8 text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Tu portafolio digital
              <span className="block bg-[linear-gradient(135deg,#635bff_0%,#4f46e5_60%,#4338ca_100%)] bg-clip-text text-transparent">
                profesional
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              Crea un portafolio impresionante, muestra tus proyectos y conecta con reclutadores de las mejores empresas tech. Todo en un solo lugar.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button className="h-12 min-w-56 rounded-2xl bg-[linear-gradient(135deg,#635bff_0%,#4f46e5_100%)] px-6 text-base font-semibold text-white shadow-[0_20px_45px_-24px_rgba(79,70,229,0.9)] transition-transform hover:scale-[1.01] active:scale-[0.99]">
                  Crear mi portafolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/explorar">
                <Button variant="outline" className="h-12 min-w-56 rounded-2xl px-6 text-base">
                  Explorar talento
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['#bbf7d0', '#fde68a', '#93c5fd', '#fca5a5'].map((color, index) => (
                    <div
                      key={index}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-slate-700 dark:border-slate-950"
                      style={{ backgroundColor: color }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                </div>
                <span>{highlights[0]}</span>
              </div>
              <span className="inline-flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                {highlights[1]}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {highlights[2]}
              </span>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-5xl rounded-[2rem] border border-slate-200 bg-white shadow-[0_40px_90px_-45px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>ethoshub.com/u/ana-garcia</span>
              <Badge className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
                Perfil verificado
              </Badge>
            </div>

            <div className="grid gap-6 p-4 sm:p-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                    AG
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Ana Garcia</h2>
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Senior Full Stack Engineer
                      </span>
                    </div>
                    <p className="mt-3 text-slate-600 dark:text-slate-300">Cochabamba, Bolivia • +8 años</p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                      Construye productos SaaS escalables con foco en experiencia de usuario, arquitectura frontend y calidad técnica.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Node.js', 'Design Systems', 'GraphQL'].map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Resumen profesional</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Listo para compartir como link directo</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    Presenta proyectos, experiencia y habilidades en un perfil elegante, verificable y pensado para reclutadores.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Search className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">Visibilidad inmediata</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Perfil, talento y networking</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {['Proyectos destacados', 'Links profesionales', 'Experiencia curada'].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="caracteristicas" className="bg-slate-50/80 py-20 dark:bg-slate-900/35">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">Características</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white">
              Todo lo que necesitas para destacar
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
              Herramientas potentes para crear un portafolio profesional y mostrar tu potencial.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950/70"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="explorar-talento" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1e1b4b_52%,#312e81_100%)] px-6 py-10 text-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.75)] sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/70">
                  Explorar talento
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                  Descubre profesionales tech antes de iniciar sesión
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                  Navega previews de perfiles públicos, evalúa trayectorias y luego desbloquea la experiencia completa con tu cuenta demo.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link to="/explorar">
                    <Button className="h-12 rounded-2xl bg-white px-6 text-base font-semibold text-slate-950 hover:bg-white/90">
                      Ver talento ahora
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="h-12 rounded-2xl border-white/25 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white"
                    >
                      Iniciar sesión
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  { icon: Globe, title: 'Perfil público', text: 'Comparte tu link profesional en segundos.' },
                  { icon: Users, title: 'Networking', text: 'Conecta con talento y reclutadores en el mismo flujo.' },
                  { icon: Briefcase, title: 'Presentación clara', text: 'Muestra experiencia, skills y proyectos de forma ordenada.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm leading-6 text-white/70">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
