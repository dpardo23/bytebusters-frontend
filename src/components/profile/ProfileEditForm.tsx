import React, { useState, ChangeEvent } from "react"
import { Camera, CloudUpload, Loader2, Code, Briefcase, Globe, FileText } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import type { UserData } from "./ProfileHeader"
import { ExperienceForm } from "./ExperienceForm"
import { EducationForm } from "./EducationForm"

interface ProfileEditFormProps {
  initialUser: UserData;
}

export function ProfileEditForm({ initialUser }: ProfileEditFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<UserData>({
    name: initialUser?.name || "",
    headline: initialUser?.headline || "",
    status: initialUser?.status || "active",
    bio: initialUser?.bio || "",
    githubUrl: initialUser?.githubUrl || "",
    linkedinUrl: initialUser?.linkedinUrl || "",
    websiteUrl: initialUser?.websiteUrl || "",
  })

  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const bioLimit = 500;
  const bioCharsLeft = bioLimit - (formData.bio?.length || 0);

  const validateDomain = (name: string, value: string): string | null => {
    if (!value) return null;
    if (name === 'githubUrl' && !value.toLowerCase().includes('github.com')) {
      return "Debe ser una URL válida de GitHub";
    }
    if (name === 'linkedinUrl' && !value.toLowerCase().includes('linkedin.com')) {
      return "Debe ser una URL válida de LinkedIn";
    }
    return null;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "bio" && value.length > bioLimit) return;
    
    setFormData(prev => ({ ...prev, [name]: value }))

    const errorMessage = validateDomain(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  }

  const handleSave = () => {
    if (Object.values(errors).some(err => err !== null)) {
      alert("Por favor, corrige los errores en los enlaces antes de guardar.");
      return;
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert("¡Perfil guardado con éxito!")
      navigate('/')
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-8 mb-20">

      {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
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
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Titular</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
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

      {/* SECCIÓN 2: SOBRE MÍ */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Sobre mí</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resumen Profesional</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
            <p className={`text-[11px] text-right font-medium ${bioCharsLeft <= 50 ? 'text-red-500' : 'text-gray-400'}`}>
              {bioCharsLeft} caracteres restantes
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: ENLACES SOCIALES */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Presencia en la Red</h3>
        </div>
        <div className="p-6 space-y-4">

          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-md">
                <Code className="w-5 h-5" />
              </div>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/tu-usuario"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.githubUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-sm`}
              />
            </div>
            {errors.githubUrl && (
              <p className="text-red-500 text-[11px] mt-1 ml-12">{errors.githubUrl}</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-md">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/tu-perfil"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.linkedinUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} text-sm`}
              />
            </div>
            {errors.linkedinUrl && (
              <p className="text-red-500 text-[11px] mt-1 ml-12">{errors.linkedinUrl}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              placeholder="https://tu-sitio.com"
              className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm border-gray-300"
            />
          </div>

        </div>
      </div>

      {/* SECCIÓN 4: EXPERIENCIA LABORAL */}
      <ExperienceForm />

      {/* SECCIÓN 5: EDUCACIÓN */}
      <EducationForm />

      {/* BOTÓN GUARDAR */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
          Guardar Cambios
        </button>
      </div>

    </div>
  )
}
