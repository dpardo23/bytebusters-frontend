import { Briefcase, CalendarRange, CheckCircle2, Layers3, MapPin, Sparkles } from 'lucide-react';

const experienceItems = [
  {
    role: 'Senior Product Engineer',
    company: 'Northlane Studio',
    period: '2023 - Actualidad',
    location: 'Remoto, LATAM',
    summary:
      'Liderando experiencias web de alto impacto, con foco en performance, consistencia visual y entregas iterativas junto a producto y diseno.',
    highlights: [
      'Migracion gradual de interfaces legacy a una base moderna en React.',
      'Diseno de patrones reutilizables para dashboard y perfiles publicos.',
      'Mejora de tiempos de carga y claridad visual en rutas clave.',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Crest Digital',
    period: '2021 - 2023',
    location: 'Buenos Aires',
    summary:
      'Construccion de paneles administrativos, landing pages y sistemas internos para equipos comerciales y de operaciones.',
    highlights: [
      'Implementacion de componentes accesibles para formularios y tablas.',
      'Colaboracion estrecha con marketing para lanzamientos rapidos.',
      'Documentacion de estilos y convenciones para nuevos integrantes.',
    ],
  },
  {
    role: 'UI Engineer',
    company: 'Freelance / Proyectos selectos',
    period: '2019 - 2021',
    location: 'Hibrido',
    summary:
      'Trabajo con startups y marcas personales creando sitios visuales, portfolios y experiencias de producto enfocadas en conversion y narrativa.',
    highlights: [
      'Construccion de experiencias estaticas elegantes y faciles de mantener.',
      'Adaptacion a identidades visuales muy distintas sin perder calidad.',
      'Entrega de interfaces responsive y listas para demo.',
    ],
  },
];

const statItems = [
  { label: 'Anios construyendo producto', value: '6+' },
  { label: 'Interfaces lanzadas', value: '28' },
  { label: 'Sistemas y dashboards', value: '11' },
];

export default function ExperiencePage() {
  return (
    <section className="space-y-6 xl:space-y-7">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative px-5 py-7 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_28%)]" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Perfil profesional
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Experiencia con foco en producto, detalle visual y ejecucion.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Esta seccion no venia armada en el ZIP, asi que deje una version estatica con
                  buena presencia visual para que el dashboard se vea completo mientras definimos la
                  carga real de experiencia laboral.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {statItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background/80 px-4 py-4 backdrop-blur"
                >
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Trayectoria</h2>
              <p className="text-sm text-muted-foreground">
                Una linea de tiempo estatica con roles, contexto y contribuciones principales.
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {experienceItems.map((item, index) => (
              <article
                key={`${item.company}-${item.role}`}
                className="relative rounded-2xl border border-border bg-background/60 p-4 sm:p-5"
              >
                {index < experienceItems.length - 1 && (
                  <div className="absolute left-[1.35rem] top-full h-5 w-px bg-border" />
                )}

                <div className="flex gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <span className="text-[10px] font-semibold">{index + 1}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{item.role}</h3>
                        <p className="text-sm font-medium text-primary">{item.company}</p>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
                        <div className="inline-flex items-center gap-2">
                          <CalendarRange className="h-4 w-4" />
                          {item.period}
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {item.location}
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>

                    <div className="mt-4 space-y-2">
                      {item.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <p className="text-sm text-foreground">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Layers3 className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Fortalezas visibles</h2>
            </div>

            <div className="space-y-3">
              {[
                'Sistemas de interfaz coherentes y mantenibles.',
                'Traduccion de ideas de producto en pantallas claras.',
                'Buen criterio para simplificar sin perder ambicion visual.',
                'Entrega estable para demos, portfolios y paneles internos.',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Nota</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Si despues quieres, esta vista estatica la convierto en una seccion editable con
              formularios, fechas, empresa, logros y reordenamiento por experiencia.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
