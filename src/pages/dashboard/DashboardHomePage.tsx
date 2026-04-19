import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Code2,
  FolderKanban,
  Link2,
  Eye,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore, useSkillsStore, useProjectsStore, useNotificationsStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent, Badge, Skeleton } from '@/shared/ui';
import RecruiterTalentSearchPage from './RecruiterTalentSearchPage';

const quickActions = [
  { to: '/dashboard/skills', icon: Code2, label: 'Habilidades', color: 'bg-blue-500' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Proyectos', color: 'bg-green-500' },
  { to: '/dashboard/connections', icon: Link2, label: 'Conexiones', color: 'bg-purple-500' },
  { to: '/dashboard/visibility', icon: Eye, label: 'Visibilidad', color: 'bg-orange-500' },
];

export default function DashboardHomePage() {
  useTranslation();
  const { user } = useAuthStore();
  const { hardSkills, fetchHardSkills, loading: skillsLoading } = useSkillsStore();
  const { projects, fetchProjects, loading: projectsLoading } = useProjectsStore();
  const { notifications, fetchNotifications } = useNotificationsStore();

  if (user?.role === 'recruiter') {
    return <RecruiterTalentSearchPage />;
  }

  useEffect(() => {
    if (user) {
      fetchHardSkills(user.id);
      fetchProjects(user.id);
      fetchNotifications(user.id);
    }
  }, [user, fetchHardSkills, fetchProjects, fetchNotifications]);

  const topSkills = hardSkills.filter((s) => s.isTop);
  const featuredProjects = projects.filter((p) => p.isFeatured);

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenido, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu portafolio profesional desde aquí
          </p>
        </div>
        <Link
          to={`/p/${user?.slug}`}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Ver mi portafolio público
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.to}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{action.label}</p>
                    <p className="text-sm text-muted-foreground">Gestionar</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top Skills
              </CardTitle>
              <Link
                to="/dashboard/skills"
                className="text-sm text-primary hover:underline"
              >
                Ver todas
              </Link>
            </CardHeader>
            <CardContent>
              {skillsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : topSkills.length > 0 ? (
                <div className="space-y-3">
                  {topSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="font-medium text-foreground">
                            {skill.skillTag.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {skill.skillTag.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{skill.level}</Badge>
                        <Badge variant="outline">
                          {skill.endorsements.length} validaciones
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No tienes top skills. Ve a Habilidades para destacar hasta 3 skills.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-green-500" />
                Proyectos Destacados
              </CardTitle>
              <Link
                to="/dashboard/projects"
                className="text-sm text-primary hover:underline"
              >
                Ver todos
              </Link>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : featuredProjects.length > 0 ? (
                <div className="space-y-3">
                  {featuredProjects.slice(0, 3).map((project) => (
                    <Link
                      key={project.id}
                      to={`/dashboard/projects/${project.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-start gap-3">
                        {project.thumbnail && (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="h-12 w-16 rounded object-cover"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {project.title}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <Badge variant={project.isPublic ? 'success' : 'secondary'}>
                          {project.isPublic ? 'Público' : 'Privado'}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No tienes proyectos destacados. Ve a Proyectos para agregar algunos.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Resumen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{hardSkills.length}</p>
                  <p className="text-sm text-muted-foreground">Hard Skills</p>
                </div>
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Proyectos</p>
                </div>
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {hardSkills.reduce((acc, s) => acc + s.endorsements.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Validaciones</p>
                </div>
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {projects.filter((p) => p.isPublic).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Públicos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 4).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 rounded-lg p-3 ${
                        notification.isRead ? 'bg-transparent' : 'bg-primary/5'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No tienes notificaciones recientes
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
