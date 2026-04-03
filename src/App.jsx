import { HeroSection } from './components/portfolio/hero-section.jsx'
import { ProfileEditForm } from './components/portfolio/profile-edit-form.jsx'
import { ExperienceSection } from './components/portfolio/experience-section.jsx' // <-- Nueva importación

function App() {
  const mockUser = {
    name: "Mauricio Jaimes",
    headline: "Frontend Developer en Formación",
    location: "Cochabamba, Bolivia",
    createdAt: "2024-01-01",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://portafolio.com",
    status: "active"
  }

  const mockExperiences = [
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
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeroSection user={mockUser} />
      <div className="px-4">
        <ProfileEditForm initialUser={mockUser} />
        <ExperienceSection experiences={mockExperiences} />
      </div>
    </div>
  )
}

export default App