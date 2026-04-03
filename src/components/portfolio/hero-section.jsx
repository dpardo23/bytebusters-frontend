import { MapPin, Calendar, Code, Briefcase, Globe, Download } from "lucide-react"

export function HeroSection({ user }) {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="w-32 h-32 flex-shrink-0 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name || "Usuario"} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-gray-400">{user?.name?.charAt(0) || "U"}</span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{user?.name || "Tu Nombre"}</h1>
            {user?.headline && <p className="text-lg text-gray-600 mb-4">{user.headline}</p>}
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 mb-6">
              {user?.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{user.location}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Miembro desde {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {user?.githubUrl && (
                <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Code className="w-4 h-4 mr-2" /> GitHub
                </a>
              )}
              {user?.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Briefcase className="w-4 h-4 mr-2" /> LinkedIn
                </a>
              )}
              {user?.websiteUrl && (
                <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  <Globe className="w-4 h-4 mr-2" /> Web
                </a>
              )}
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