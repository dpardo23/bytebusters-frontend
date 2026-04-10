import React, { useState, ChangeEvent, useRef } from "react"
import { Camera, CloudUpload, Loader2, Code, Briefcase, Globe, FileText, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import type { UserData } from "./ProfileHeader" 
import { ExperienceForm } from "./ExperienceForm"
import { EducationForm } from "./EducationForm"

interface ExtendedUserData extends UserData {
  statusMessage?: string;
  id?: string | number;
}

interface ProfileEditFormProps {
  initialUser: ExtendedUserData;
}

export function ProfileEditForm({ initialUser }: ProfileEditFormProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<ExtendedUserData>({
    name: initialUser?.name || "",
    headline: initialUser?.headline || "",
    status: initialUser?.status || "active",
    bio: initialUser?.bio || "",
    statusMessage: initialUser?.statusMessage || "",
    githubUrl: initialUser?.githubUrl || "",
    linkedinUrl: initialUser?.linkedinUrl || "",
    websiteUrl: initialUser?.websiteUrl || "",
  })

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name.trim() !== "" && formData.headline.trim() !== "" && (photoFile !== null || photoPreview !== null);
    }
    if (currentStep === 2) {
      return formData.bio.trim().length >= 20;
    }
    return true;
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!isStepValid()) return;
    
    setIsLoading(true);
    try {
      const userId = initialUser.id; 
      if (!userId) {
        throw new Error("No se pudo identificar el usuario para guardar el perfil");
      }

      const heroData = new FormData();
      heroData.append('data', new Blob([JSON.stringify({ 
        userId: userId, 
        name: formData.name, 
        professionalTitle: formData.headline 
      })], { type: "application/json" }));
      if (photoFile) heroData.append('photo', photoFile);
      const heroResponse = await fetch(`/api/profile/hero-section`, { method: 'PATCH', body: heroData });
      if (!heroResponse.ok) {
        throw new Error("No se pudo guardar la informacion basica");
      }

      const backendStatus = formData.status === 'active' ? 'A' : formData.status === 'busy' ? 'B' : 'N';
      const statusParams = new URLSearchParams({ 
        status: backendStatus, 
        message: formData.statusMessage || "", 
        incognito: String(formData.status === 'incognito') 
      });
      const statusResponse = await fetch(`/api/profile/status/${userId}?${statusParams.toString()}`, { method: 'PUT' });
      if (!statusResponse.ok) {
        throw new Error("No se pudo guardar el estado del perfil");
      }

      const biographyResponse = await fetch(`/api/biography/${userId}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'text/plain' }, 
        body: formData.bio 
      });
      if (!biographyResponse.ok) {
        throw new Error("No se pudo guardar la biografia");
      }

      alert("¡Perfil completado con éxito!");
      navigate('/');
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mb-20">
      
      <nav className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-gray-200 text-gray-500'}`}>
              {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
            </div>
            {step < 3 && <div className={`w-12 h-1 ml-4 rounded ${currentStep > step ? 'bg-primary' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </nav>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden text-left">
        
        {currentStep === 1 && (
          <section className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Información Básica</h2>
            <p className="text-gray-500 mb-8">Comencemos con lo esencial para que otros te reconozcan.</p>
            
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden" />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-28 h-28 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-primary/20 transition-all overflow-hidden"
                >
                  {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : <Camera className="w-10 h-10 text-gray-400" />}
                </div>
                <span className="text-sm font-medium text-primary">Subir foto obligatoria *</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Juan Pérez" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Titular Profesional *</label>
                  <input type="text" name="headline" value={formData.headline} onChange={handleChange} placeholder="Ej. Desarrollador Fullstack" className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
            </div>
          </section>
        )}

        {currentStep === 2 && (
          <section className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sobre ti</h2>
            <p className="text-gray-500 mb-8">Cuéntale al mundo quién eres y cuál es tu situación actual.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Biografía / Resumen * (mín. 20 caracteres)</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={6} placeholder="Escribe algo interesante sobre tu carrera..." className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none transition-all" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">¿Estás disponible? *</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary">
                    <option value="active">Disponible</option>
                    <option value="busy">Ocupado</option>
                    <option value="incognito">Incógnito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mensaje corto</label>
                  <input type="text" name="statusMessage" value={formData.statusMessage} onChange={handleChange} placeholder="Ej. ¡Buscando retos!" className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Presencia Digital</h2>
            <p className="text-gray-500 mb-8">Añade tus enlaces para que puedan ver tu trabajo.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-1 border rounded-xl focus-within:ring-2 focus-within:ring-primary transition-all">
                <div className="p-3 bg-gray-100 rounded-lg"><Code className="w-5 h-5" /></div>
                <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub URL" className="flex-1 outline-none text-sm" />
              </div>
              <div className="flex items-center gap-3 p-1 border rounded-xl focus-within:ring-2 focus-within:ring-primary transition-all">
                <div className="p-3 bg-primary/10 rounded-lg"><Briefcase className="w-5 h-5 text-primary" /></div>
                <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL" className="flex-1 outline-none text-sm" />
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-primary/10 rounded-xl border border-primary/20 flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-xs text-primary leading-relaxed">
                Al finalizar, tu perfil será público. Podrás añadir tu experiencia laboral y educación detallada desde tu panel de edición en cualquier momento.
              </p>
            </div>
          </section>
        )}

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button 
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className={`flex items-center gap-2 px-4 py-2 font-medium text-gray-600 hover:text-gray-900 transition-colors ${currentStep === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          {currentStep < 3 ? (
            <button 
              type="button"
              disabled={!isStepValid()}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-all shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              Finalizar Registro
            </button>
          )}
        </div>
      </div>
    </div>
  )
}