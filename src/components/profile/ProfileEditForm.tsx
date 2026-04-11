import React, { useState, ChangeEvent, useRef, useEffect } from "react"
import { Loader2, CloudUpload, CheckCircle2, Edit3, X, Share2 } from "lucide-react"

import type { ExtendedUserData, Section } from "../../types/profile.types"
import { Sidebar } from "./Sidebar"
import { BasicInfoSection } from "./BasicInfoSection"
import { PublicViewSection } from "./PublicViewSection"
import { ExperienceForm } from "./ExperienceForm" 
import { EducationForm } from "./EducationForm" 
import { SocialLinks } from "./SocialLinks"

interface ProfileEditFormProps {
  initialUser: ExtendedUserData;
}

export function ProfileEditForm({ initialUser }: ProfileEditFormProps) {
  if (!initialUser || !initialUser.id) {
    return <div className="p-20 text-center font-medium text-gray-500">Cargando datos...</div>;
  }

  const [activeSection, setActiveSection] = useState<Section>('basic');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  
  const [originalData, setOriginalData] = useState<ExtendedUserData & { socialLinks?: any[], photoBase64?: string }>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ExtendedUserData & { socialLinks?: any[] }>({
    ...initialUser,
    socialLinks: []
  });

  // 1. CARGAR DATOS
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const profileId = Number(initialUser.id);
        const [statusRes, bioRes, heroRes, linksRes] = await Promise.all([
          fetch(`/api/profile/status/${profileId}`).catch(() => ({ ok: false, json: () => ({}) })),
          fetch(`/api/biography/${profileId}`).catch(() => ({ ok: false, text: () => "" })),
          fetch(`/api/profile/hero-section/${profileId}`).catch(() => ({ ok: false, json: () => ({}) })),
          fetch(`/api/profile/${profileId}/social-links`).catch(() => ({ ok: false, json: () => [] }))
        ]);

        let loadedData: any = { ...initialUser };

        if (statusRes.ok) {
          const s = await (statusRes as Response).json();
          loadedData.status = s.status === 'A' ? 'active' : s.status === 'B' ? 'busy' : 'incognito';
          loadedData.statusMessage = s.statusMessage || "";
        }
        if (bioRes.ok) loadedData.bio = await (bioRes as Response).text();
        
        if (heroRes.ok) {
          const h = await (heroRes as Response).json();
          console.log("DATOS DEL BACKEND HERO:", h);
          loadedData.name = h.name || "";
          loadedData.headline = h.headline || "";
          
          // SOLUCIÓN BUG 1: Guardamos la foto en el backup
          if (h.photoBase64) {
            setPhotoPreview(h.photoBase64);
            loadedData.photoBase64 = h.photoBase64; 
          }
        }
        
        if (linksRes.ok) {
          const l = await (linksRes as Response).json();
          loadedData.socialLinks = Array.isArray(l) ? l : [];
        } else {
          loadedData.socialLinks = [];
        }

        setFormData(loadedData);
        setOriginalData(loadedData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchAllData();
  }, [initialUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancelEdit = () => {
    setFormData(originalData);
    setPhotoFile(null);
    // Ahora originalData sí tiene la foto guardada
    setPhotoPreview(originalData.photoBase64 || null); 
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrors({});

    try {
      const profileId = Number(initialUser.id);

      const heroData = new FormData();
      heroData.append('data', new Blob([JSON.stringify({ userId: profileId, name: formData.name, professionalTitle: formData.headline })], { type: "application/json" }));
      if (photoFile) heroData.append('photo', photoFile);
      await fetch('/api/profile/hero-section', { method: 'PATCH', body: heroData });

      const backendStatus = formData.status === 'active' ? 'A' : formData.status === 'busy' ? 'B' : 'N';
      const statusParams = new URLSearchParams({ status: backendStatus, message: formData.statusMessage || "", incognito: String(formData.status === 'incognito') });
      await fetch(`/api/profile/status/${profileId}?${statusParams.toString()}`, { method: 'PUT' });

      await fetch(`/api/biography/${profileId}`, { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: formData.bio || "" });

      const originalLinks = originalData.socialLinks || [];
      const currentLinks = formData.socialLinks || [];
      
      const deletedLinks = originalLinks.filter(orig => 
        orig.sociallinksId && !currentLinks.some(curr => curr.sociallinksId === orig.sociallinksId)
      );
      
      for (const link of deletedLinks) {
        await fetch(`/api/profile/${profileId}/social-links/${link.sociallinksId}`, { method: 'DELETE' });
      }

      const linksToSave = currentLinks.filter(l => l.plataformId && l.url);
      for (const link of linksToSave) {
        const method = link.sociallinksId ? 'PUT' : 'POST';
        const url = link.sociallinksId 
          ? `/api/profile/${profileId}/social-links/${link.sociallinksId}` 
          : `/api/profile/${profileId}/social-links`;

        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plataformId: parseInt(link.plataformId.toString()), url: link.url })
        });
      }

      const newLinksRes = await fetch(`/api/profile/${profileId}/social-links`);
      let finalLinks = [];
      if (newLinksRes.ok) finalLinks = await newLinksRes.json();

      const finalData = { ...formData, socialLinks: finalLinks, photoBase64: photoPreview };
      
      setFormData(finalData);
      setOriginalData(finalData);
      
      setSuccessMessage("¡Perfil actualizado con éxito!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error: any) {
      setErrors({ global: "Ocurrió un error inesperado al guardar." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <div className="py-20 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-20 flex flex-col md:flex-row gap-8 px-4">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main className="flex-1 min-w-0 flex flex-col">
        {errors.global && <div className="p-4 mb-4 text-sm font-medium text-red-800 rounded-xl bg-red-50 border">{errors.global}</div>}
        {successMessage && <div className="p-4 mb-4 text-sm font-medium text-green-800 rounded-xl bg-green-50 border flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {successMessage}</div>}
        
        <div className="space-y-6 flex-1">
          {activeSection === 'basic' && (
            <BasicInfoSection 
              formData={formData} isEditing={isEditing} errors={errors} handleChange={handleChange} 
              fileInputRef={fileInputRef} handlePhotoChange={(e) => {
                const f = e.target.files?.[0];
                if(f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)); }
              }} photoPreview={photoPreview} 
            />
          )}

          {activeSection === 'public' && (
            <div className="space-y-6 animate-in fade-in">
               <PublicViewSection 
                formData={formData} isEditing={isEditing} isSavingDraft={isSavingDraft} handleChange={handleChange} 
              />
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <Share2 className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-bold text-gray-900">Redes Sociales</h3>
                </div>
                <SocialLinks 
                  links={formData.socialLinks || []} 
                  onChange={(newLinks) => setFormData(prev => ({ ...prev, socialLinks: newLinks }))} 
                  isEditing={isEditing} 
                />
              </div>
            </div>
          )}

          {activeSection === 'experience' && <ExperienceForm profileId={Number(initialUser.id)} isEditingProfile={true} />}
          {activeSection === 'education' && <EducationForm profileId={Number(initialUser.id)} isEditingProfile={true} />}
        </div>

        {(activeSection === 'basic' || activeSection === 'public') && (
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all">
                <Edit3 className="w-4 h-4" /> Editar Perfil
              </button>
            ) : (
              <>
                <button onClick={handleCancelEdit} disabled={isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
                  <X className="w-4 h-4" /> Cancelar
                </button>
                <button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
                  Guardar Cambios
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  )
}