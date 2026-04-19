import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  Folder,
  Eye,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  Activity,
  AlertCircle,
  Clock,
  MoreHorizontal,
  Download,
  RefreshCw,
  Shield,
  Ban,
  Mail,
  ExternalLink,
  Settings,
  Zap,
  Database,
  Globe,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Avatar,
  LoadingSpinner,
  Dropdown,
} from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

// Mock data
const platformStats = [
  {
    label: 'Total Users',
    value: '12,847',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    label: 'Active Portfolios',
    value: '8,234',
    change: '+8.2%',
    trend: 'up' as const,
    icon: Folder,
  },
  {
    label: 'Page Views (30d)',
    value: '1.2M',
    change: '+15.3%',
    trend: 'up' as const,
    icon: Eye,
  },
  {
    label: 'Avg. Session Duration',
    value: '4m 32s',
    change: '-2.1%',
    trend: 'down' as const,
    icon: Clock,
  },
];

const userGrowthData = [
  { month: 'Jan', users: 4500, active: 3200 },
  { month: 'Feb', users: 5200, active: 3800 },
  { month: 'Mar', users: 6100, active: 4500 },
  { month: 'Apr', users: 7300, active: 5400 },
  { month: 'May', users: 8900, active: 6700 },
  { month: 'Jun', users: 10500, active: 8100 },
  { month: 'Jul', users: 12847, active: 9850 },
];

const recentUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?u=john',
    joinedAt: '2024-01-15T10:30:00Z',
    status: 'active',
    portfolioViews: 234,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    joinedAt: '2024-01-14T15:45:00Z',
    status: 'active',
    portfolioViews: 567,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    joinedAt: '2024-01-13T09:20:00Z',
    status: 'pending',
    portfolioViews: 12,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    joinedAt: '2024-01-12T14:10:00Z',
    status: 'suspended',
    portfolioViews: 0,
  },
  {
    id: '5',
    name: 'Alex Brown',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    joinedAt: '2024-01-11T11:55:00Z',
    status: 'active',
    portfolioViews: 891,
  },
];

const systemHealth = [
  { name: 'API Server', status: 'healthy', uptime: '99.99%', latency: '45ms' },
  { name: 'Database', status: 'healthy', uptime: '99.95%', latency: '12ms' },
  { name: 'CDN', status: 'healthy', uptime: '100%', latency: '8ms' },
  { name: 'Auth Service', status: 'degraded', uptime: '99.80%', latency: '120ms' },
];

const recentActivity = [
  { type: 'user_signup', message: 'New user signed up', user: 'john@example.com', time: '5 min ago' },
  { type: 'portfolio_create', message: 'Portfolio created', user: 'jane@example.com', time: '12 min ago' },
  { type: 'project_add', message: 'New project added', user: 'mike@example.com', time: '25 min ago' },
  { type: 'report', message: 'Content reported', user: 'system', time: '1 hour ago' },
  { type: 'user_upgrade', message: 'User upgraded to Pro', user: 'sarah@example.com', time: '2 hours ago' },
];

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getUserActions = (_userId: string, status: string) => [
    { label: 'View Profile', icon: ExternalLink, onClick: () => {} },
    { label: 'Send Email', icon: Mail, onClick: () => {} },
    { type: 'divider' as const },
    status !== 'suspended'
      ? { label: 'Suspend User', icon: Ban, onClick: () => {}, danger: true }
      : { label: 'Unsuspend User', icon: Shield, onClick: () => {} },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.dashboardSubtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('admin.exportReport')}
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            {t('admin.settings')}
          </Button>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <Badge
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className={cn(
                    stat.trend === 'up'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  )}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Growth Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('admin.userGrowth')}</h2>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Total Users"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorActive)"
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('admin.systemHealth')}</h2>
            <Badge variant="default" className="bg-green-500/10 text-green-500">
              <Activity className="w-3 h-3 mr-1" />
              {t('admin.operational')}
            </Badge>
          </div>
          <div className="space-y-4">
            {systemHealth.map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      service.status === 'healthy' && 'bg-green-500',
                      service.status === 'degraded' && 'bg-yellow-500',
                      service.status === 'down' && 'bg-red-500'
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.latency} latency</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{service.uptime}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Users and Activity Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('admin.recentUsers')}</h2>
            <Button variant="ghost" size="sm">
              {t('admin.viewAll')}
            </Button>
          </div>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      user.status === 'active'
                        ? 'default'
                        : user.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                    className={cn(
                      user.status === 'active' && 'bg-green-500/10 text-green-500',
                      user.status === 'pending' && 'bg-yellow-500/10 text-yellow-500',
                      user.status === 'suspended' && 'bg-red-500/10 text-red-500'
                    )}
                  >
                    {user.status}
                  </Badge>
                  <Dropdown items={getUserActions(user.id, user.status)}>
                    <button className="p-1 rounded hover:bg-muted">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </Dropdown>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">{t('admin.recentActivity')}</h2>
            <Button variant="ghost" size="sm">
              {t('admin.viewAll')}
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    activity.type === 'user_signup' && 'bg-green-500/10',
                    activity.type === 'portfolio_create' && 'bg-blue-500/10',
                    activity.type === 'project_add' && 'bg-purple-500/10',
                    activity.type === 'report' && 'bg-red-500/10',
                    activity.type === 'user_upgrade' && 'bg-yellow-500/10'
                  )}
                >
                  {activity.type === 'user_signup' && <UserPlus className="w-4 h-4 text-green-500" />}
                  {activity.type === 'portfolio_create' && <Folder className="w-4 h-4 text-blue-500" />}
                  {activity.type === 'project_add' && <Zap className="w-4 h-4 text-purple-500" />}
                  {activity.type === 'report' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {activity.type === 'user_upgrade' && <TrendingUp className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t('admin.quickActions')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Button variant="outline" className="flex-col h-auto py-4">
            <Users className="w-6 h-6 mb-2" />
            <span className="text-sm">{t('admin.manageUsers')}</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4">
            <AlertCircle className="w-6 h-6 mb-2" />
            <span className="text-sm">{t('admin.viewReports')}</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4">
            <Database className="w-6 h-6 mb-2" />
            <span className="text-sm">{t('admin.databaseBackup')}</span>
          </Button>
          <Button variant="outline" className="flex-col h-auto py-4">
            <Globe className="w-6 h-6 mb-2" />
            <span className="text-sm">{t('admin.siteSettings')}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
