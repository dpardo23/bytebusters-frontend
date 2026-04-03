import { HeroSection } from './components/portfolio/hero-section'

function App() {
  // Datos de prueba para simular la base de datos
  const mockUser = {
    name: "Mauricio Jaimes",
    headline: "Frontend Developer en Formación",
    location: "Cochabamba, Bolivia",
    createdAt: "2024-01-01",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    websiteUrl: "https://portafolio.com"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Aquí estamos usando tu componente y pasándole los datos */}
      <HeroSection user={mockUser} />
    </div>
  )
}

export default App
