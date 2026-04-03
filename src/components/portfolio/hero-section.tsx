import { MapPin, Calendar, Download } from "lucide-react"
import { StatusBadge } from "./status-badge"
import { SocialLinks } from "./social-links"

export interface UserData {
  name?: string;
  headline?: string;
  location?: string;
  status?: string;
  lastActive?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  bio?: string;
}

interface HeroSectionProps {
  user: UserData;
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="w-32 h-32 flex-shrink-0 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-400">{user?.name?.charAt(0) || "U"}</span>
          </div>

          <div className="flex-1 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center md:items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{user?.name || "Tu Nombre"}</h1>
              <StatusBadge status={user?.status || "active"} lastActive={user?.lastActive} />
            </div>
            
            <p className="text-lg text-gray-600 mb-4">{user?.headline || "Sin titular"}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 mb-6">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user?.location || "Ubicación"}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Miembro desde 2024</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <SocialLinks 
                githubUrl={user?.githubUrl} 
                linkedinUrl={user?.linkedinUrl} 
                websiteUrl={user?.websiteUrl} 
              />
              
              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" /> Descargar CV
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}