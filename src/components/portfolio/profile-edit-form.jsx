import { useState } from "react"
import { Camera, Save, Loader2, Info, Code, Briefcase, Globe } from "lucide-react"

export function ProfileEditForm({ initialUser }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialUser?.name || "",
    headline: initialUser?.headline || "",
    status: initialUser?.status || "active", 
    githubUrl: initialUser?.githubUrl || "",
    linkedinUrl: initialUser?.linkedinUrl || "",
    websiteUrl: initialUser?.websiteUrl || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("¡Perfil y estado actualizados!")
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-8 mb-20">
      
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
        </div>
        <div className="p-6 space-y-6 text-left">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 text-left">Sube una foto cuadrada de al menos 400x400px.</p>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Titular</label>
              <input type="text" name="headline" value={formData.headline} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            
            <div className="space-y-2 mt-2">
              <label className="block text-sm font-medium text-gray-700">Estado de Disponibilidad</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="active">🟢 Disponible para contratar</option>
                <option value="busy">🟠 Trabajando actualmente</option>
                <option value="incognito">⚪ No disponible (Modo Incógnito)</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Presencia en la Red</h3>
          <p className="text-sm text-gray-500">Añade enlaces a tus perfiles profesionales.</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-md"><Code className="w-5 h-5" /></div>
            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/tu-usuario" className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-md"><Briefcase className="w-5 h-5 text-blue-600" /></div>
            <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/tu-perfil" className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md"><Globe className="w-5 h-5 text-green-600" /></div>
            <input type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange} placeholder="https://tu-sitio.com" className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Guardar Cambios
        </button>
      </div>
    </div>
  )
}