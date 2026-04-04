/**
 * DevFolio Mock Data
 * Version: 2.0 - Clean rebuild
 */

export type UserRole = 'professional' | 'recruiter' | 'admin'
export type UserPlan = 'free' | 'pro' | 'business'
export type AvailabilityStatus = 'open-to-work' | 'freelancing' | 'hiring' | 'focused' | 'neutral'

export interface AvailabilityBadgeState {
  status: AvailabilityStatus
  customText?: string
  isIncognito: boolean
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar: string
  role: UserRole
  plan: UserPlan
  slug: string
  headline?: string
  bio?: string
  location?: string
  website?: string
  websiteUrl?: string
  github?: string
  githubUrl?: string
  linkedin?: string
  linkedinUrl?: string
  twitter?: string
  isPublic: boolean
  createdAt: string
  isVerified?: boolean
  availabilityBadge?: AvailabilityBadgeState
}

export interface ProjectAttachment {
  id: string
  projectId: string
  name: string
  type: 'image' | 'document' | 'video' | 'other'
  url: string
  size: number
  mimeType: string
  uploadedAt: string
  description?: string
}

export interface Project {
  id: string
  userId: string
  title: string
  description: string
  longDescription?: string
  imageUrl: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  createdAt: string
  views: number
  likes: number
  attachments?: ProjectAttachment[]
}

export interface Skill {
  id: string
  userId: string
  name: string
  level: number
  category: string
  yearsOfExperience?: number
}

export interface Experience {
  id: string
  userId: string
  company: string
  companyLogo?: string
  position: string
  employmentType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  startDate: string
  endDate?: string
  current: boolean
  description: string
  location: string
  locationType: 'on-site' | 'remote' | 'hybrid'
  skills: string[]
  achievements?: string[]
}

export interface Education {
  id: string
  userId: string
  institution: string
  institutionLogo?: string
  degree: string
  field: string
  type: 'formal' | 'certification'
  startDate: string
  endDate?: string
  current: boolean
  grade?: string
  honors?: string
  certificateUrl?: string
  certificateImage?: string
  verificationUrl?: string
  provider?: 'udemy' | 'coursera' | 'platzi' | 'linkedin' | 'google' | 'aws' | 'microsoft' | 'other'
}

export interface ProfileStats {
  views: number
  uniqueVisitors: number
  profileClicks: number
  projectViews: number
  contactRequests: number
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  totalRecruiters: number
  newUsersThisMonth: number
  revenue: number
}

export interface SavedCandidate {
  id: string
  odId: string
  savedAt: string
  notes?: string
  tags: string[]
}

export interface ContactRequest {
  id: string
  visitorId: string
  professionalId: string
  toUserId?: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  read?: boolean
}

export interface Profile {
  id: string
  userId: string
  name: string
  email: string
  avatar: string
  headline: string
  title: string
  location: string
  bio: string
  skills: { name: string }[]
  experience: number
  isAvailable: boolean
  isPublic: boolean
  slug: string
}

export interface SkillCategory {
  name: string
  skills: { name: string; count: number }[]
}

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'ana.garcia@email.com',
    name: 'Ana Garcia',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    role: 'professional',
    plan: 'pro',
    slug: 'ana-garcia',
    headline: 'Full Stack Developer | React & Node.js Expert',
    bio: 'Desarrolladora apasionada con 5 anos de experiencia',
    location: 'Madrid, Espana',
    website: 'https://anagarcia.dev',
    websiteUrl: 'https://anagarcia.dev',
    github: 'anagarcia',
    githubUrl: 'https://github.com/anagarcia',
    linkedin: 'anagarcia',
    linkedinUrl: 'https://linkedin.com/in/anagarcia',
    isPublic: true,
    createdAt: '2023-01-15',
    availabilityBadge: {
      status: 'open-to-work',
      customText: 'React Projects',
      isIncognito: false,
      updatedAt: '2026-03-26T10:30:00.000Z',
    },
  },
  {
    id: 'user-2',
    email: 'carlos.lopez@email.com',
    name: 'Carlos Lopez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    role: 'professional',
    plan: 'free',
    slug: 'carlos-lopez',
    headline: 'Senior Backend Engineer | Python & Go',
    bio: 'Ingeniero de backend con experiencia en sistemas distribuidos',
    location: 'Barcelona, Espana',
    github: 'carloslopez',
    githubUrl: 'https://github.com/carloslopez',
    isPublic: true,
    createdAt: '2023-02-20',
    availabilityBadge: {
      status: 'focused',
      customText: 'Arquitectura backend',
      isIncognito: false,
      updatedAt: '2026-03-24T14:00:00.000Z',
    },
  },
  {
    id: 'user-3',
    email: 'recruiter@techcorp.com',
    name: 'Maria Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    role: 'recruiter',
    plan: 'business',
    slug: 'maria-rodriguez',
    headline: 'Tech Recruiter at TechCorp',
    location: 'Madrid, Espana',
    isPublic: false,
    createdAt: '2023-03-10',
  },
  {
    id: 'user-4',
    email: 'admin@devfolio.com',
    name: 'Admin DevFolio',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    role: 'admin',
    plan: 'business',
    slug: 'admin',
    isPublic: false,
    createdAt: '2022-01-01',
  },
  {
    id: 'user-5',
    email: 'laura.martinez@email.com',
    name: 'Laura Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    role: 'professional',
    plan: 'pro',
    slug: 'laura-martinez',
    headline: 'UX/UI Designer & Frontend Developer',
    bio: 'Disenadora con vision de desarrollo',
    location: 'Valencia, Espana',
    websiteUrl: 'https://lauramartinez.design',
    isPublic: true,
    createdAt: '2023-04-05',
    availabilityBadge: {
      status: 'freelancing',
      customText: 'Brand systems',
      isIncognito: false,
      updatedAt: '2026-03-20T09:15:00.000Z',
    },
  },
  {
    id: 'user-6',
    email: 'miguel.fernandez@email.com',
    name: 'Miguel Fernandez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    role: 'professional',
    plan: 'free',
    slug: 'miguel-fernandez',
    headline: 'DevOps Engineer | Cloud Infrastructure',
    location: 'Sevilla, Espana',
    isPublic: true,
    createdAt: '2023-05-12',
    availabilityBadge: {
      status: 'hiring',
      customText: 'Equipo platform',
      isIncognito: false,
      updatedAt: '2026-03-22T08:00:00.000Z',
    },
  },
]

export const mockSkills: Record<string, Skill[]> = {
  'user-1': [
    { id: 's1', userId: 'user-1', name: 'React', level: 95, category: 'Frontend', yearsOfExperience: 5 },
    { id: 's2', userId: 'user-1', name: 'TypeScript', level: 90, category: 'Languages', yearsOfExperience: 4 },
    { id: 's3', userId: 'user-1', name: 'Node.js', level: 85, category: 'Backend', yearsOfExperience: 4 },
    { id: 's4', userId: 'user-1', name: 'PostgreSQL', level: 80, category: 'Database', yearsOfExperience: 3 },
    { id: 's5', userId: 'user-1', name: 'Next.js', level: 90, category: 'Frontend', yearsOfExperience: 3 },
    { id: 's6', userId: 'user-1', name: 'TailwindCSS', level: 85, category: 'Frontend', yearsOfExperience: 2 },
  ],
  'user-2': [
    { id: 's7', userId: 'user-2', name: 'Python', level: 95, category: 'Languages', yearsOfExperience: 7 },
    { id: 's8', userId: 'user-2', name: 'Go', level: 85, category: 'Languages', yearsOfExperience: 4 },
    { id: 's9', userId: 'user-2', name: 'Kubernetes', level: 80, category: 'DevOps', yearsOfExperience: 3 },
  ],
}

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    userId: 'user-1',
    title: 'E-Commerce Platform',
    description: 'Plataforma de comercio electronico completa con carrito y pagos',
    longDescription: 'Una plataforma moderna de e-commerce construida con Next.js y Stripe',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    liveUrl: 'https://ecommerce-demo.vercel.app',
    githubUrl: 'https://github.com/anagarcia/ecommerce',
    featured: true,
    createdAt: '2024-01-15',
    views: 1250,
    likes: 89,
  },
  {
    id: 'proj-2',
    userId: 'user-1',
    title: 'Task Manager App',
    description: 'Aplicacion de gestion de tareas con colaboracion en tiempo real',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    technologies: ['React', 'Firebase', 'TailwindCSS'],
    liveUrl: 'https://taskmanager-demo.vercel.app',
    featured: true,
    createdAt: '2024-02-20',
    views: 890,
    likes: 56,
  },
  {
    id: 'proj-3',
    userId: 'user-1',
    title: 'Weather Dashboard',
    description: 'Dashboard del clima con pronosticos y visualizaciones',
    imageUrl: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800',
    technologies: ['React', 'Chart.js', 'OpenWeather API'],
    featured: false,
    createdAt: '2024-03-10',
    views: 456,
    likes: 23,
  },
  {
    id: 'proj-4',
    userId: 'user-2',
    title: 'API Gateway Service',
    description: 'Microservicio de API Gateway con rate limiting y autenticacion',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    technologies: ['Go', 'Redis', 'Docker', 'Kubernetes'],
    githubUrl: 'https://github.com/carloslopez/api-gateway',
    featured: true,
    createdAt: '2024-01-20',
    views: 2100,
    likes: 145,
  },
]

const _educationData: Education[] = [
  {
    id: 'edu-1',
    userId: 'user-1',
    institution: 'Universidad Politecnica de Madrid',
    institutionLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=UPM',
    degree: 'Grado en Ingenieria Informatica',
    field: 'Ingenieria de Software',
    type: 'formal',
    startDate: '2015-09-01',
    endDate: '2019-06-30',
    current: false,
    grade: '8.5/10',
    honors: 'Matricula de Honor en TFG',
  },
  {
    id: 'edu-2',
    userId: 'user-1',
    institution: 'Coursera',
    institutionLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Coursera',
    degree: 'Meta Front-End Developer Professional Certificate',
    field: 'Desarrollo Frontend',
    type: 'certification',
    startDate: '2022-01-01',
    endDate: '2022-06-30',
    current: false,
    provider: 'coursera',
    certificateUrl: 'https://coursera.org/verify/123',
  },
  {
    id: 'edu-3',
    userId: 'user-2',
    institution: 'Universidad de Barcelona',
    institutionLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=UB',
    degree: 'Master en Ciencia de Datos',
    field: 'Data Science',
    type: 'formal',
    startDate: '2019-09-01',
    endDate: '2021-06-30',
    current: false,
    grade: '9.2/10',
  },
]

const _experienceData: Experience[] = [
  {
    id: 'exp-1',
    userId: 'user-1',
    company: 'TechStartup SL',
    companyLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechStartup',
    position: 'Senior Full Stack Developer',
    employmentType: 'full-time',
    startDate: '2022-03-01',
    current: true,
    description: 'Liderando el desarrollo de plataforma SaaS',
    location: 'Madrid, Espana',
    locationType: 'hybrid',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    achievements: ['Reduccion del tiempo de carga en 40%'],
  },
  {
    id: 'exp-2',
    userId: 'user-1',
    company: 'Digital Agency',
    companyLogo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Digital',
    position: 'Full Stack Developer',
    employmentType: 'full-time',
    startDate: '2020-01-15',
    endDate: '2022-02-28',
    current: false,
    description: 'Desarrollo de aplicaciones web',
    location: 'Madrid, Espana',
    locationType: 'on-site',
    skills: ['Vue.js', 'Laravel', 'MySQL'],
  },
  {
    id: 'exp-3',
    userId: 'user-2',
    company: 'BigData Corp',
    position: 'Lead Backend Engineer',
    employmentType: 'full-time',
    startDate: '2021-06-01',
    current: true,
    description: 'Liderando equipo de backend',
    location: 'Barcelona, Espana',
    locationType: 'remote',
    skills: ['Python', 'Go', 'Kubernetes'],
  },
]

export const mockEducation: Education[] = _educationData
export const mockExperience: Experience[] = _experienceData

export const mockProfileStats: Record<string, ProfileStats> = {
  'user-1': {
    views: 1523,
    uniqueVisitors: 892,
    profileClicks: 234,
    projectViews: 3421,
    contactRequests: 12,
  },
  'user-2': {
    views: 2100,
    uniqueVisitors: 1200,
    profileClicks: 345,
    projectViews: 5600,
    contactRequests: 23,
  },
}

export const mockAdminStats: AdminStats = {
  totalUsers: 15234,
  activeUsers: 8921,
  totalProjects: 45678,
  totalRecruiters: 1234,
  newUsersThisMonth: 523,
  revenue: 45230,
}

export const mockAnalyticsData = {
  viewsToday: 156,
  viewsWeek: 1234,
  viewsMonth: 4567,
  topCountries: [
    { country: 'Espana', views: 2345 },
    { country: 'Mexico', views: 1234 },
    { country: 'Argentina', views: 890 },
  ],
  topReferrers: [
    { source: 'LinkedIn', views: 1500 },
    { source: 'Google', views: 1200 },
    { source: 'GitHub', views: 800 },
  ],
}

export const mockAnalytics = mockAnalyticsData

export const mockSavedCandidates: SavedCandidate[] = [
  { id: 'sc-1', odId: 'user-1', savedAt: '2024-03-15', notes: 'Excelente perfil', tags: ['frontend', 'react'] },
  { id: 'sc-2', odId: 'user-2', savedAt: '2024-03-10', tags: ['backend', 'python'] },
]

export const mockContactRequests: ContactRequest[] = [
  {
    id: 'cr-1',
    visitorId: 'user-3',
    professionalId: 'user-1',
    toUserId: 'user-1',
    message: 'Me gustaria hablar sobre una oportunidad',
    status: 'pending',
    createdAt: '2024-03-20',
    read: false,
  },
]

export const mockProfiles: Profile[] = [
  {
    id: 'profile-1',
    userId: 'user-1',
    name: 'Ana Garcia',
    email: 'ana.garcia@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    headline: 'Full Stack Developer | React & Node.js Expert',
    title: 'Full Stack Developer | React & Node.js Expert',
    location: 'Madrid, Espana',
    bio: 'Desarrolladora apasionada con 5 anos de experiencia',
    skills: [{ name: 'React' }, { name: 'TypeScript' }, { name: 'Node.js' }],
    experience: 5,
    isAvailable: true,
    isPublic: true,
    slug: 'ana-garcia',
  },
  {
    id: 'profile-2',
    userId: 'user-2',
    name: 'Carlos Lopez',
    email: 'carlos.lopez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    headline: 'Senior Backend Engineer',
    title: 'Senior Backend Engineer',
    location: 'Barcelona, Espana',
    bio: 'Ingeniero de backend',
    skills: [{ name: 'Python' }, { name: 'Go' }, { name: 'Kubernetes' }],
    experience: 7,
    isAvailable: true,
    isPublic: true,
    slug: 'carlos-lopez',
  },
  {
    id: 'profile-5',
    userId: 'user-5',
    name: 'Laura Martinez',
    email: 'laura.martinez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    headline: 'UX/UI Designer',
    title: 'UX/UI Designer',
    location: 'Valencia, Espana',
    bio: 'Disenadora con vision de desarrollo',
    skills: [{ name: 'Figma' }, { name: 'React' }, { name: 'CSS' }],
    experience: 4,
    isAvailable: false,
    isPublic: true,
    slug: 'laura-martinez',
  },
  {
    id: 'profile-6',
    userId: 'user-6',
    name: 'Miguel Fernandez',
    email: 'miguel.fernandez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    headline: 'DevOps Engineer',
    title: 'DevOps Engineer',
    location: 'Sevilla, Espana',
    bio: 'Especialista en infraestructura cloud',
    skills: [{ name: 'AWS' }, { name: 'Docker' }, { name: 'Terraform' }],
    experience: 6,
    isAvailable: true,
    isPublic: true,
    slug: 'miguel-fernandez',
  },
]

export const mockSkillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'React', count: 156 },
      { name: 'Vue.js', count: 89 },
      { name: 'TypeScript', count: 134 },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Node.js', count: 145 },
      { name: 'Python', count: 123 },
      { name: 'Go', count: 56 },
    ],
  },
  {
    name: 'Database',
    skills: [
      { name: 'PostgreSQL', count: 134 },
      { name: 'MongoDB', count: 98 },
    ],
  },
]

export function getUserById(userId: string): User | undefined {
  return mockUsers.find((user) => user.id === userId)
}

export function getUserBySlug(slug: string): User | undefined {
  return mockUsers.find((user) => user.slug === slug)
}

export function getProjectsByUserId(userId: string): Project[] {
  return mockProjects.filter((project) => project.userId === userId)
}

export function getSkillsByUserId(userId: string): Skill[] {
  return mockSkills[userId] || []
}

export function getExperienceByUserId(userId: string): Experience[] {
  return _experienceData.filter((experience) => experience.userId === userId)
}

export function getEducationByUserId(userId: string): Education[] {
  return _educationData.filter((education) => education.userId === userId)
}

export function getPublicProfessionals(): User[] {
  return mockUsers.filter((user) => user.role === 'professional' && user.isPublic)
}

export function searchProfessionals(query: string): User[] {
  const lowerQuery = query.toLowerCase()
  return getPublicProfessionals().filter(
    (user) =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.headline?.toLowerCase().includes(lowerQuery) ||
      user.location?.toLowerCase().includes(lowerQuery),
  )
}