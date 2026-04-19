import { useEffect, useMemo } from 'react';
import {
  Briefcase,
  Globe2,
  Grip,
  Languages,
  LayoutTemplate,
  Mail,
  MapPin,
  MoonStar,
  ShieldCheck,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { Badge, Card, EmptyState, LoadingSpinner } from '@/shared/ui';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';

const workSignals = [
  'Disponible para colaboraciones de producto y frontend.',
  'Interes por proyectos con impacto visible y buena narrativa visual.',
  'Preferencia por equipos pequenos, iteracion rapida y ownership claro.',
];

export default function PreferencesPage() {
  const { user } = useAuthStore();
  const { preferences, loading, error, fetchPreferences } = usePreferencesStore();

  useEffect(() => {
    if (user?.id) {
      fetchPreferences(user.id);
    }
  }, [fetchPreferences, user?.id]);

  const orderedSections = useMemo(() => {
    return preferences?.sectionOrder ?? ['bio', 'skills', 'projects', 'experience', 'contact'];
  }, [preferences?.sectionOrder]);

  if (loading && !preferences) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState
        icon={UserCircle2}
        title="No hay usuario activo"
        description="Inicia sesion como profesional para ver esta pantalla de preferencias."
      />
    );
  }

  return (
    <section className="space-y-6 xl:space-y-7">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="relative px-5 py-7 sm:px-8 sm:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(249,115,22,0.10),_transparent_28%)]" />
          <div className="relative grid gap-5 sm:gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Modo profesional
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                  Preferencias del perfil profesional
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Deje esta vista con informacion estatica bien presentada para que la cuenta de
                  usuario profesional tenga una seccion de preferencias clara, util y visualmente
                  completa.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {user.role}
                </Badge>
                <Badge variant="outline">{user.profession}</Badge>
                <Badge variant="outline">Perfil activo</Badge>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background/80 p-4 sm:p-5 backdrop-blur">
              <div className="flex items-start gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-foreground">{user.name}</p>
                  <p className="text-sm text-primary">{user.profession}</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4" />
                      <span className="truncate">{user.website || 'Sitio personal pendiente'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-muted-foreground">{error}</p>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Preferencias de cuenta</h2>
                <p className="text-sm text-muted-foreground">
                  Ajustes base cargados desde el perfil del usuario profesional.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <PreferenceTile
                icon={Languages}
                label="Idioma"
                value={preferences?.language === 'en' ? 'English' : 'Español'}
                hint="Definido para la interfaz principal."
              />
              <PreferenceTile
                icon={MoonStar}
                label="Tema"
                value={preferences?.theme ?? 'light'}
                hint="Preferencia visual guardada localmente."
              />
              <PreferenceTile
                icon={ShieldCheck}
                label="Heatmap GitHub"
                value={preferences?.showGithubHeatmap ? 'Visible' : 'Oculto'}
                hint="Control rapido para el perfil publico."
              />
              <PreferenceTile
                icon={Briefcase}
                label="Recomendaciones LinkedIn"
                value={preferences?.showLinkedinRecommendations ? 'Activadas' : 'Desactivadas'}
                hint="Ideal para reforzar credibilidad profesional."
              />
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Grip className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Orden del portafolio</h2>
                <p className="text-sm text-muted-foreground">
                  Secuencia sugerida para un profesional que quiere comunicar claridad y recorrido.
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {orderedSections.map((section, index) => (
                <div
                  key={`${section}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{formatSectionLabel(section)}</p>
                      <p className="text-xs text-muted-foreground">
                        {sectionDescription(section)}
                      </p>
                    </div>
                  </div>
                  <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Senales de trabajo</h2>
            <div className="mt-4 space-y-3">
              {workSignals.map((signal) => (
                <div key={signal} className="rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground">
                  {signal}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-foreground">Resumen del perfil</h2>
            <div className="mt-4 space-y-4">
              <SummaryRow label="Slug publico" value={user.slug} />
              <SummaryRow label="Rol activo" value={user.role} />
              <SummaryRow label="Ubicacion" value={user.location} />
              <SummaryRow label="Sitio personal" value={user.website || 'No configurado'} />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function PreferenceTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium text-foreground">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatSectionLabel(section: string) {
  const map: Record<string, string> = {
    bio: 'Biografia',
    skills: 'Skills',
    projects: 'Proyectos',
    experience: 'Experiencia',
    contact: 'Contacto',
  };

  return map[section] ?? section;
}

function sectionDescription(section: string) {
  const map: Record<string, string> = {
    bio: 'Presentacion y contexto profesional.',
    skills: 'Capacidades tecnicas y fortalezas clave.',
    projects: 'Casos visibles y trabajo demostrado.',
    experience: 'Trayectoria y evolucion del perfil.',
    contact: 'Canales de contacto y conversion.',
  };

  return map[section] ?? 'Seccion del portafolio.';
}
