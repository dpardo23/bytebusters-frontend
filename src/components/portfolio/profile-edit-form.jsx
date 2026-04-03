import { useState } from "react"
import { Camera, Save, Loader2, Info } from "lucide-react"

export function ProfileEditForm({ initialUser }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: initialUser?.name || "",
    headline: initialUser?.headline || "",
  })

  const headlineLimit = 100
  const headlineCharsLeft = headlineLimit - formData.headline.length

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "name" && value.length > 50) return
    if (name === "headline" && value.length > 100) return
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    if (!formData.name.trim()) return alert("El nombre es obligatorio")
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("¡Perfil actualizado con éxito!");
    }, 1000)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mt-8 max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
        <p className="text-sm text-gray-500">Configura tu identidad visual y titular profesional.</p>
      </div>
      <div className="p-6 space-y-6 text-left">
        
        {/* Avatar interactivo */}
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center transition-opacity group-hover:opacity-80">
              <span className="text-3xl font-bold text-gray-400">{formData.name.charAt(0) || "U"}</span>
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="w-6 h-6" />
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <p className="text-sm text-gray-500">Haz clic en la imagen para cambiar tu foto de perfil.</p>
        </div>

        <div className="grid gap-4">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre Público *</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[10px] text-gray-400 text-right">{formData.name.length}/50</p>
          </div>
          
          {/* Campo Titular */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-700">Titular Profesional</label>
              <Info className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <input 
              type="text" 
              name="headline" 
              value={formData.headline} 
              onChange={handleChange} 
              placeholder="Ej. Software Engineer | React Specialist"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className={`text-[10px] text-right ${headlineCharsLeft < 10 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
              {headlineCharsLeft} caracteres restantes
            </p>
          </div>
        </div>

        <button 
          onClick={handleSave} 
          disabled={isLoading}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  )
}