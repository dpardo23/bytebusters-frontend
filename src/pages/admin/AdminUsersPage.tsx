import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  MoreHorizontal,
  Mail,
  ExternalLink,
  Shield,
  Ban,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Building,
  ArrowUpDown,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Avatar,
  Input,
  Modal,
  LoadingSpinner,
  Dropdown,
  EmptyState,
} from '@/shared/ui';
import { formatDate } from '@/shared/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'pending' | 'suspended' | 'deleted';
  createdAt: string;
  lastLogin?: string;
  location?: string;
  company?: string;
  portfolioViews: number;
  projectsCount: number;
  connectionsCount: number;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ana Martinez',
    email: 'ana@example.com',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    username: 'anamartinez',
    role: 'user',
    status: 'active',
    createdAt: '2023-06-15T10:30:00Z',
    lastLogin: '2024-01-15T14:20:00Z',
    location: 'Madrid, Spain',
    company: 'TechCorp',
    portfolioViews: 1234,
    projectsCount: 8,
    connectionsCount: 156,
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?u=john',
    username: 'johndoe',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-10T08:15:00Z',
    lastLogin: '2024-01-16T09:00:00Z',
    location: 'New York, USA',
    company: 'StartupXYZ',
    portfolioViews: 5678,
    projectsCount: 15,
    connectionsCount: 342,
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    username: 'janesmith',
    role: 'moderator',
    status: 'active',
    createdAt: '2023-03-20T12:00:00Z',
    lastLogin: '2024-01-14T18:45:00Z',
    location: 'London, UK',
    portfolioViews: 2345,
    projectsCount: 6,
    connectionsCount: 89,
  },
  {
    id: '4',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    username: 'mikej',
    role: 'user',
    status: 'pending',
    createdAt: '2024-01-10T15:30:00Z',
    portfolioViews: 12,
    projectsCount: 0,
    connectionsCount: 0,
  },
  {
    id: '5',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    username: 'sarahw',
    role: 'user',
    status: 'suspended',
    createdAt: '2023-08-05T09:20:00Z',
    lastLogin: '2023-12-20T11:30:00Z',
    location: 'Berlin, Germany',
    portfolioViews: 567,
    projectsCount: 3,
    connectionsCount: 45,
  },
];

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; userId: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'portfolioViews'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'portfolioViews') {
        comparison = a.portfolioViews - b.portfolioViews;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'name' | 'createdAt' | 'portfolioViews') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleAction = (action: string, user: User) => {
    if (action === 'view') {
      setSelectedUser(user);
      setDetailModalOpen(true);
    } else if (action === 'suspend' || action === 'delete' || action === 'unsuspend') {
      setConfirmAction({ type: action, userId: user.id });
      setConfirmModalOpen(true);
    }
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      // Handle the action
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === confirmAction.userId) {
            if (confirmAction.type === 'suspend') {
              return { ...u, status: 'suspended' as const };
            } else if (confirmAction.type === 'unsuspend') {
              return { ...u, status: 'active' as const };
            } else if (confirmAction.type === 'delete') {
              return { ...u, status: 'deleted' as const };
            }
          }
          return u;
        })
      );
    }
    setConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const getUserActions = (user: User) => [
    { label: t('admin.viewDetails'), icon: Eye, onClick: () => handleAction('view', user) },
    { label: t('admin.editUser'), icon: Edit, onClick: () => {} },
    { label: t('admin.sendEmail'), icon: Mail, onClick: () => {} },
    { type: 'divider' as const },
    user.status !== 'suspended'
      ? {
          label: t('admin.suspendUser'),
          icon: Ban,
          onClick: () => handleAction('suspend', user),
          danger: true,
        }
      : {
          label: t('admin.unsuspendUser'),
          icon: Shield,
          onClick: () => handleAction('unsuspend', user),
        },
    {
      label: t('admin.deleteUser'),
      icon: Trash2,
      onClick: () => handleAction('delete', user),
      danger: true,
    },
  ];

  const getStatusBadge = (status: User['status']) => {
    const variants = {
      active: { className: 'bg-green-500/10 text-green-500', icon: CheckCircle },
      pending: { className: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
      suspended: { className: 'bg-red-500/10 text-red-500', icon: XCircle },
      deleted: { className: 'bg-gray-500/10 text-gray-500', icon: Trash2 },
    };
    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <Badge variant="secondary" className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: User['role']) => {
    const variants = {
      admin: 'bg-purple-500/10 text-purple-500',
      moderator: 'bg-blue-500/10 text-blue-500',
      user: 'bg-gray-500/10 text-gray-500',
    };

    return (
      <Badge variant="secondary" className={variants[role]}>
        {role}
      </Badge>
    );
  };

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
          <h1 className="text-2xl font-bold text-foreground">{t('admin.userManagement')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('admin.totalUsers', { count: users.length })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {t('admin.export')}
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            {t('admin.addUser')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.searchUsers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="all">{t('admin.allStatuses')}</option>
              <option value="active">{t('admin.active')}</option>
              <option value="pending">{t('admin.pending')}</option>
              <option value="suspended">{t('admin.suspended')}</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
            >
              <option value="all">{t('admin.allRoles')}</option>
              <option value="admin">{t('admin.admin')}</option>
              <option value="moderator">{t('admin.moderator')}</option>
              <option value="user">{t('admin.user')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        {paginatedUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('admin.noUsersFound')}
            description={t('admin.noUsersFoundDesc')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {t('admin.user')}
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      {t('admin.role')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      {t('admin.status')}
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort('createdAt')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {t('admin.joined')}
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort('portfolioViews')}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {t('admin.views')}
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3 px-4 text-sm font-medium text-muted-foreground w-16" />
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} name={user.name} size="sm" />
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">
                          {user.portfolioViews.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Dropdown items={getUserActions(user)}>
                          <button className="p-1 rounded hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </Dropdown>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {t('admin.showing', {
                  start: (currentPage - 1) * itemsPerPage + 1,
                  end: Math.min(currentPage * itemsPerPage, filteredUsers.length),
                  total: filteredUsers.length,
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* User Detail Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedUser(null);
        }}
        title={t('admin.userDetails')}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar src={selectedUser.avatar} name={selectedUser.name} size="xl" />
              <div>
                <h3 className="text-xl font-semibold text-foreground">{selectedUser.name}</h3>
                <p className="text-muted-foreground">@{selectedUser.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('admin.email')}</p>
                <p className="text-foreground">{selectedUser.email}</p>
              </div>
              {selectedUser.location && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('admin.location')}</p>
                  <p className="flex items-center gap-1 text-foreground">
                    <MapPin className="w-4 h-4" />
                    {selectedUser.location}
                  </p>
                </div>
              )}
              {selectedUser.company && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t('admin.company')}</p>
                  <p className="flex items-center gap-1 text-foreground">
                    <Building className="w-4 h-4" />
                    {selectedUser.company}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t('admin.joined')}</p>
                <p className="flex items-center gap-1 text-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {selectedUser.portfolioViews.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{t('admin.views')}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selectedUser.projectsCount}</p>
                <p className="text-sm text-muted-foreground">{t('admin.projects')}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{selectedUser.connectionsCount}</p>
                <p className="text-sm text-muted-foreground">{t('admin.connections')}</p>
              </Card>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDetailModalOpen(false)}>
                {t('common.close')}
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                {t('admin.viewPortfolio')}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setConfirmAction(null);
        }}
        title={t('admin.confirmAction')}
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {confirmAction?.type === 'suspend' && t('admin.confirmSuspend')}
            {confirmAction?.type === 'unsuspend' && t('admin.confirmUnsuspend')}
            {confirmAction?.type === 'delete' && t('admin.confirmDelete')}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant={confirmAction?.type === 'delete' ? 'destructive' : 'default'}
              onClick={confirmActionHandler}
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
