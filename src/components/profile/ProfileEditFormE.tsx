import React, { useState, ChangeEvent, useRef, useEffect } from "react"
import { Camera, CloudUpload, Loader2, Code, Briefcase, Globe, FileText, CheckCircle2, Edit3, X } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import type { UserData } from "./ProfileHeader"
import { ExperienceForm } from "./ExperienceForm"
import { EducationForm } from "./EducationForm"


interface ExtendedUserData extends UserData {
  statusMessage?: string;
  id?: string | number; 
  photoBase64?: string; // <-- ¡AQUÍ ESTÁ LA SOLUCIÓN! Agregamos esta línea
}
interface ProfileEditFormProps {
  initialUser: ExtendedUserData;
}

export function ProfileEditForm({ initialUser }: ProfileEditFormProps) {
  const navigate = useNavigate()
  
  // ----------------------------------------------------------------------
  // NUEVOS ESTADOS PARA MODO EDICIÓN Y CARGA INICIAL
  // ----------------------------------------------------------------------
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [originalData, setOriginalData] = useState<ExtendedUserData>(initialUser)

  // Estados de carga e interfaz
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Referencias y estado de la imagen
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Estado principal del formulario
  const [formData, setFormData] = useState<ExtendedUserData>(initialUser)

  // Contadores de caracteres
  const bioLimit = 500;
  const bioCharsLeft = bioLimit - (formData.bio?.length || 0);
  const statusMessageCharsLeft = 50 - (formData.statusMessage?.length || 0);

  // ----------------------------------------------------------------------
  // OBTENER DATOS DE LA BASE DE DATOS AL CARGAR LA PÁGINA
  // ----------------------------------------------------------------------
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Usamos el ID real heredado del usuario autenticado
        const currentUserId = initialUser.id; 

        if (!currentUserId) {
          console.error("No se encontró el ID del usuario.");
          setIsLoadingData(false);
          return;
        }

        const [statusRes, bioRes, heroRes] = await Promise.all([
          fetch(`/api/profile/status/${currentUserId}`),
          fetch(`/api/biography/${currentUserId}`),
          fetch(`/api/profile/hero-section/${currentUserId}`) 
        ]);

        let loadedData = { ...initialUser };

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          loadedData.status = statusData.status === 'A' ? 'active' : statusData.status === 'B' ? 'busy' : 'incognito';
          loadedData.statusMessage = statusData.statusMessage || "";
        }

        if (bioRes.ok) {
          const bioData = await bioRes.text(); 
          loadedData.bio = bioData;
        }

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          loadedData.name = heroData.name || "";
          loadedData.headline = heroData.headline || "";
          
          if (heroData.photoBase64) {
            setPhotoPreview(heroData.photoBase64);
          }
        }

        setFormData(loadedData);
        setOriginalData(loadedData);

      } catch (error) {
        console.error("Error al cargar los datos del perfil:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProfileData();
  }, [initialUser]);

  // ----------------------------------------------------------------------
  // AUTO-GUARDADO DE BIOGRAFÍA
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!isEditing || !formData.bio || formData.bio === originalData.bio) return;

    const timeoutId = setTimeout(async () => {
      setIsSavingDraft(true);
      try {
        // Agregamos el ID del usuario a la petición de auto-guardado si tu backend lo requiere
        // Asumiendo que /api/biography/draft requiere un query param o que el ID va en el body.
        // Si tu backend maneja el ID mediante token JWT, este fetch está bien así.
        await fetch('/api/biography/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: formData.bio
        });
      } catch (error) {
        console.error("Error al auto-guardar el borrador", error);
      } finally {
        setIsSavingDraft(false);
      }
    }, 2000); 

    return () => clearTimeout(timeoutId);
  }, [formData.bio, originalData.bio, isEditing]);

  // ----------------------------------------------------------------------
  // MANEJADORES DE EVENTOS
  // ----------------------------------------------------------------------
  const handleCancelEdit = () => {
    setFormData(originalData);
    setPhotoFile(null);
    setPhotoPreview(originalData.photoBase64 || null); // Intenta restaurar la foto original si existía
    setErrors({});
    setIsEditing(false);
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, photo: "Solo se permiten formatos JPG, PNG y WebP" }));
      return;
    }

    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, photo: "El archivo excede el límite permitido de 5MB" }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: null }));
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  const validateHeroSection = (): boolean => {
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "El nombre no puede exceder los 50 caracteres";
      isValid = false;
    } else if (!/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo puede contener letras y espacios";
      isValid = false;
    }

    if (formData.headline && formData.headline.length > 100) {
      newErrors.headline = "El titular no puede exceder los 100 caracteres";
      isValid = false;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > bioLimit) return;
    if (name === "statusMessage" && value.length > 50) return; 

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  }

  // ----------------------------------------------------------------------
  // GUARDADO FINAL
  // ----------------------------------------------------------------------
  const handleSave = async () => {
    if (!validateHeroSection()) return;

    setIsLoading(true);
    setSuccessMessage(null);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      // Incluimos el userId en el JSON de la data
      formDataToSend.append('data', new Blob([JSON.stringify({ 
        userId: initialUser.id, 
        name: formData.name, 
        professionalTitle: formData.headline 
      })], { type: "application/json" }));
      
      if (photoFile) formDataToSend.append('photo', photoFile);

      const responseHero = await fetch('/api/profile/hero-section', { method: 'PATCH', body: formDataToSend });
      if (!responseHero.ok) throw new Error("Error al guardar la información básica");

      const backendStatus = formData.status === 'active' ? 'A' : formData.status === 'busy' ? 'B' : 'N';
      const statusParams = new URLSearchParams({ 
        status: backendStatus, 
        message: formData.statusMessage || "", 
        incognito: String(formData.status === 'incognito') 
      });

      // Si tu backend necesita el ID aquí, tendrías que agregarlo, por ejemplo: /api/profile/status/${initialUser.id}?${statusParams}
      const responseStatus = await fetch(`/api/profile/status?${statusParams.toString()}`, { method: 'PUT' });
      if (!responseStatus.ok) throw new Error("No se pudo actualizar el estado de disponibilidad");

      // Si tu backend necesita el ID aquí, igual.
      const responseBio = await fetch('/api/biography', { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: formData.bio });
      if (!responseBio.ok) throw new Error("No se pudo guardar la biografía por políticas de contenido");

      setSuccessMessage("¡Perfil actualizado con éxito!");
      setOriginalData(formData);
      setIsEditing(false);

      setTimeout(() => setSuccessMessage(null), 3000);

    } catch (error: any) {
      setErrors(prev => ({ ...prev, global: error.message }));
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-8 mb-20">

      {/* ALERTAS */}
      {errors.global && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{errors.global}</div>
      )}
      {successMessage && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />{successMessage}
        </div>
      )}

      {/* BOTONERA PRINCIPAL (EDITAR / GUARDAR / CANCELAR) */}
      <div className="flex justify-end gap-3 mb-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            <Edit3 className="w-4 h-4" /> Editar Perfil
          </button>
        ) : (
          <>
            <button
              onClick={handleCancelEdit}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              Guardar Cambios
            </button>
          </>
        )}
      </div>

      {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
      <div className={`bg-white border rounded-xl shadow-sm overflow-hidden transition-colors ${isEditing ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'}`}>
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
        </div>
        <div className="p-6 space-y-6 text-left">
          
          <div className="flex items-center gap-6">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept=".jpg,.jpeg,.png,.webp" 
              className="hidden" 
              disabled={!isEditing}
            />
            <button 
              type="button"
              onClick={() => isEditing && fileInputRef.current?.click()}
              disabled={!isEditing}
              className={`w-20 h-20 rounded-full flex items-center justify-center border-2 border-dashed overflow-hidden shrink-0 
                ${isEditing ? 'bg-gray-100 border-gray-300 hover:bg-gray-200 cursor-pointer' : 'bg-gray-50 border-gray-200 cursor-default'}`}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className={`w-6 h-6 ${isEditing ? 'text-gray-400' : 'text-gray-300'}`} />
              )}
            </button>
            {isEditing && (
              <div className="flex flex-col">
                <p className="text-sm text-gray-500 text-left">Sube una foto cuadrada (JPG, PNG, WebP) de hasta 5MB.</p>
                {errors.photo && <span className="text-red-500 text-xs mt-1">{errors.photo}</span>}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre Completo {isEditing && <span className="text-red-500">*</span>}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md outline-none transition-all
                  ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent font-medium' : errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
              />
              {errors.name && isEditing && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Titular / Profesión</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md outline-none transition-all
                  ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent font-medium' : errors.headline ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
              />
              {errors.headline && isEditing && <p className="text-red-500 text-xs">{errors.headline}</p>}
            </div>

            <div className="space-y-2 mt-2">
              <label className="block text-sm font-medium text-gray-700">Estado de Disponibilidad</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border rounded-md outline-none transition-all
                  ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent appearance-none font-medium' : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
              >
                <option value="active">🟢 Disponible para contratar</option>
                <option value="busy">🟠 Trabajando actualmente</option>
                <option value="incognito">⚪ No disponible (Modo Incógnito)</option>
              </select>
            </div>

            {(isEditing || formData.statusMessage) && (
              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium text-gray-700">Mensaje de Estado</label>
                <input
                  type="text"
                  name="statusMessage"
                  value={formData.statusMessage}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Ej: Buscando nuevos retos en React..."
                  className={`w-full px-3 py-2 border rounded-md outline-none transition-all
                    ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent italic' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm'}`}
                />
                {isEditing && (
                  <p className={`text-[11px] text-right font-medium ${statusMessageCharsLeft <= 10 ? 'text-red-500' : 'text-gray-400'}`}>
                    {statusMessageCharsLeft} caracteres restantes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: SOBRE MÍ */}
      <div className={`bg-white border rounded-xl shadow-sm overflow-hidden text-left transition-colors ${isEditing ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'}`}>
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Sobre mí</h3>
          </div>
          {isSavingDraft && isEditing && (
            <span className="text-xs text-gray-400 italic flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Guardando borrador...
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resumen Profesional</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              rows={5}
              placeholder={isEditing ? "Cuéntanos sobre ti..." : "Sin información"}
              className={`w-full px-3 py-2 border rounded-md outline-none resize-none transition-all
                ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
            />
            {isEditing && (
              <p className={`text-[11px] text-right font-medium ${bioCharsLeft <= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                {bioCharsLeft} caracteres restantes
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: ENLACES SOCIALES */}
      <div className={`bg-white border rounded-xl shadow-sm overflow-hidden text-left transition-colors ${isEditing ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'}`}>
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Presencia en la Red</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-md"><Code className="w-5 h-5 text-gray-600" /></div>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://github.com/tu-usuario"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none text-sm transition-all
                  ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-md"><Briefcase className="w-5 h-5 text-blue-600" /></div>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://linkedin.com/in/tu-perfil"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none text-sm transition-all
                  ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-md"><Globe className="w-5 h-5 text-green-600" /></div>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://tu-sitio.com"
              className={`flex-1 px-3 py-2 border rounded-md outline-none text-sm transition-all
                ${!isEditing ? 'bg-gray-50 text-gray-600 border-transparent' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`}
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: EXPERIENCIA LABORAL */}
      <ExperienceForm />

      {/* SECCIÓN 5: EDUCACIÓN */}
      <EducationForm isEditingProfile={isEditing} />

    </div>
  )
}