import { HeroSection, UserData } from './components/portfolio/hero-section'
import { ProfileEditForm } from './components/portfolio/profile-edit-form'
import { ExperienceSection, ExperienceData } from './components/portfolio/experience-section'
import { EducationSection, EducationData } from './components/portfolio/education-section'
import { GuestConversion } from './components/portfolio/guest-conversion'

function App() {
  const haceDosHoras = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  
  const isGuestMode = true;

  const mockUser: UserData = {
    name: "Mauricio Jaimes",
    headline: "Frontend Developer en Formación",
    location: "Cochabamba, Bolivia",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://portafolio.com",
    status: "active",
    lastActive: haceDosHoras,
  }

  const mockExperiences: ExperienceData[] = [
    {
      role: "Desarrollador Frontend Junior",
      company: "Tech Solutions",
      location: "Remoto",
      startDate: "Ene 2025",
      endDate: "Presente",
      description: "Desarrollo de interfaces de usuario utilizando React y Tailwind CSS. Colaboración en la migración de aplicaciones web y consumo de APIs RESTful."
    },
    {
      role: "Pasante de Desarrollo Web",
      company: "Agencia Creativa",
      location: "Cochabamba, Bolivia",
      startDate: "Jun 2024",
      endDate: "Dic 2024",
      description: "Mantenimiento de sitios web, maquetación de nuevos componentes interactivos y optimización de rendimiento."
    },
    {
      role: "Desarrollador Freelance",
      company: "Cliente Privado",
      location: "Remoto",
      startDate: "Ene 2024",
      endDate: "May 2024",
      description: "Este trabajo se verá borroso para usuarios invitados."
    }
  ]

  const mockEducation: EducationData[] = [
    {
      school: "Universidad Mayor de San Simón",
      degree: "Ingeniería de Sistemas",
      startDate: "2026-04-03",
      endDate: "",
      isCurrent: true
    },
    {
      school: "Platzi",
      degree: "Curso de Desarrollo Web Frontend",
      startDate: "2024-01-01",
      endDate: "2024-06-01",
      isCurrent: false
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <GuestConversion isGuest={isGuestMode} />
      <HeroSection user={{ ...mockUser, isGuest: isGuestMode }} />
      <div className="px-4">
        <ProfileEditForm initialUser={mockUser} />
        <ExperienceSection experiences={mockExperiences} isGuest={isGuestMode} />
        <EducationSection education={mockEducation} />
      </div>
    </div>
  )
}

export default App