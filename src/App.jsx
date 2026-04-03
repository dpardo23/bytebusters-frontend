import { HeroSection } from './components/portfolio/hero-section.jsx'
import { ProfileEditForm } from './components/portfolio/profile-edit-form.jsx' // <--- ¿Tienes esta línea?

function App() {
  const mockUser = {
    name: "Mauricio Jaimes",
    headline: "Frontend Developer en Formación",
    location: "Cochabamba, Bolivia",
    createdAt: "2024-01-01",
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <HeroSection user={mockUser} />
      
      {/* --- ESTA ES LA PARTE QUE FALTA EN TU CAPTURA --- */}
      <div className="px-4">
        <ProfileEditForm initialUser={mockUser} />
      </div>
      {/* ----------------------------------------------- */}
    </div>
  )
}

export default App