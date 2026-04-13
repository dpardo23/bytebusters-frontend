import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Briefcase, Plus, Edit2, Trash2, X, Loader2, Calendar, Building, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

export interface ExperienceData {
  id?: number;
  jobPosition: string; 
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
  isFreelance: boolean;
  companyUrl?: string;
  durationFormatted?: string; 
}

interface ExperienceFormProps {
  profileId?: string | number; 
  isEditingProfile?: boolean;
}

export function ExperienceForm({ profileId, isEditingProfile = true }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const companyImageInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [companyImageFile, setCompanyImageFile] = useState<File | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<ExperienceData>({
    jobPosition: "", company: "", startDate: "", endDate: "", description: "", isCurrent: false, isFreelance: false, companyUrl: ""
  });

  useEffect(() => {
    if (profileId) fetchExperiences();
  }, [profileId]);

  const fetchExperiences = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch(`/api/profile/${profileId}/work-experience`);
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error("Error cargando experiencia:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleOpenModal = (exp?: ExperienceData) => {
    setError("");
    setLogoFile(null);
    setCompanyImageFile(null);

    if (exp) {
      setFormData({
        ...exp,
        endDate: exp.endDate || "",
        companyUrl: exp.companyUrl || ""
      });
      setEditingId(exp.id || null);
    } else {
      setFormData({ jobPosition: "", company: "", startDate: "", endDate: "", description: "", isCurrent: false, isFreelance: false, companyUrl: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setError("");

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked,
        ...(name === 'isCurrent' && checked ? { endDate: "" } : {}),
        ...(name === 'isFreelance' && checked ? { company: "" } : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`El archivo ${file.name} supera el límite de 5MB.`);
        e.target.value = ''; 
        return;
      }
      setError("");
      setFileState(file);
    } else {
      setFileState(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) {
      setError("Falta el ID del perfil");
      return;
    }
    
    if (!editingId && (!logoFile || !companyImageFile)) {
      setError("El Logo y la Imagen de la Empresa son obligatorios.");
      return;
    }

    if (formData.startDate > todayStr) {
      setError("La fecha de inicio no puede ser en el futuro.");
      return;
    }

    if (!formData.isCurrent && formData.endDate) {
      if (formData.endDate > todayStr) {
        setError("La fecha final no puede ser en el futuro.");
        return;
      }
      if (formData.endDate < formData.startDate) {
        setError("La fecha final no puede ser anterior a la de inicio.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(formData));
      if (logoFile) formDataToSend.append('logo', logoFile);
      if (companyImageFile) formDataToSend.append('companyImage', companyImageFile);

      const url = editingId 
        ? `/api/profile/${profileId}/work-experience/${editingId}`
        : `/api/profile/${profileId}/work-experience`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        body: formDataToSend
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al guardar la experiencia");
      }

      await fetchExperiences();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;
    try {
      await fetch(`/api/profile/${profileId}/work-experience/${itemToDelete}`, { method: 'DELETE' });
      await fetchExperiences();
    } catch (error) {
      setError("Error al eliminar");
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm text-left mb-6 transition-colors ${isEditingProfile ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200'}`}>
      
      <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-600" /> Experiencia Laboral
        </h3>
        {isEditingProfile && (
          <button onClick={() => handleOpenModal()} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200">
            <Plus className="w-4 h-4" /> Añadir
          </button>
        )}
      </div>

      <div className="p-6">
        {isLoadingList ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
        ) : experiences.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-4">Aún no hay experiencia registrada.</p>
        ) : (
          <div className="relative border-l-2 border-indigo-100 ml-3 md:ml-4 space-y-8 pb-4 pt-2">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative pl-6 md:pl-8 group">
                
                <div className={`absolute w-4 h-4 rounded-full -left-[9px] top-1.5 ring-4 ring-white shadow-sm z-10 
                  ${exp.isCurrent ? 'bg-green-500' : 'bg-indigo-300'}`}
                >
                  {exp.isCurrent && <span className="absolute inset-0 w-full h-full rounded-full bg-green-400 animate-ping opacity-75"></span>}
                </div>

                {exp.isCurrent && index === 0 && (
                  <div className="absolute -left-[2px] bottom-full h-6 w-0.5 bg-gradient-to-t from-green-500 to-transparent" />
                )}

                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{exp.jobPosition}</h4>
                      
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-700 font-medium">
                        {exp.isFreelance ? (
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold border border-indigo-100">Freelance</span>
                        ) : (
                          <Building className="w-4 h-4 text-gray-400" />
                        )}
                        {exp.company || "Trabajador Independiente"}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                        <div className={`flex items-center gap-1 font-medium ${exp.isCurrent ? 'text-green-600' : ''}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.startDate} - {exp.isCurrent ? "Actualidad" : exp.endDate}
                        </div>
                        {exp.durationFormatted && (
                          <span className="text-gray-400 font-medium">- {exp.durationFormatted}</span>
                        )}
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(exp)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setItemToDelete(exp.id!)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  
                  {exp.companyUrl && (
                    <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                      <LinkIcon className="w-3 h-3" /> Ver sitio web
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {itemToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar experiencia?</h3>
            <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" /> {editingId ? 'Editar' : 'Añadir'} Experiencia
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
                  {error}
                </div>
              )}

              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isFreelance" checked={formData.isFreelance} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-800 font-bold">Trabajo Freelance / Proyecto Independiente</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Cargo o Rol *</label>
                  <input required type="text" name="jobPosition" value={formData.jobPosition} onChange={handleChange} placeholder="Ej: Desarrollador Backend" className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Empresa {!formData.isFreelance && '*'}</label>
                  <input required={!formData.isFreelance} type="text" name="company" value={formData.company} onChange={handleChange} placeholder={formData.isFreelance ? "Opcional para Freelancers" : "Nombre de la empresa"} disabled={formData.isFreelance} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400" />
                </div>
              </div>

              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-800 font-medium">Trabajo aquí actualmente</span>
                </label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Fecha de inicio *</label>
                    {/* CORRECCIÓN 2: Limitamos el calendario HTML usando max={todayStr} */}
                    <input required type="date" name="startDate" value={formData.startDate} max={todayStr} onChange={handleChange} className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase">Fecha final</label>
                    {/* CORRECCIÓN 2 y 3: Limitamos maximo al día de hoy, y minimo a la fecha de inicio */}
                    <input required={!formData.isCurrent} disabled={formData.isCurrent || !formData.startDate} type="date" name="endDate" value={formData.endDate || ""} max={todayStr} min={formData.startDate} onChange={handleChange} className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400`} />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Descripción de responsabilidades *</label>
                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Describe tus logros y tareas principales..." className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Enlace de la empresa (Opcional)</label>
                <div className="flex items-center gap-2 border rounded-xl px-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
                  <LinkIcon className="w-4 h-4 text-gray-400" />
                  <input type="url" name="companyUrl" value={formData.companyUrl || ""} onChange={handleChange} placeholder="https://empresa.com" className="w-full py-2.5 outline-none text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-xl border-dashed bg-gray-50">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Logo Empresa {!editingId && '*'}</label>
                  <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, setLogoFile)} className="hidden" accept="image/*" />
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full py-2.5 px-3 border border-gray-300 bg-white hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                    <ImageIcon className="w-4 h-4 text-gray-500" /> {logoFile ? logoFile.name : 'Subir Logo (Solo Imagen)'}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Imagen Destacada {!editingId && '*'}</label>
                  <input type="file" ref={companyImageInputRef} onChange={(e) => handleFileChange(e, setCompanyImageFile)} className="hidden" accept="image/*,application/pdf" />
                  <button type="button" onClick={() => companyImageInputRef.current?.click()} className="flex items-center justify-center gap-2 w-full py-2.5 px-3 border border-gray-300 bg-white hover:bg-gray-50 rounded-xl text-sm font-medium text-gray-700 transition-colors">
                    <ImageIcon className="w-4 h-4 text-gray-500" /> {companyImageFile ? companyImageFile.name : 'Subir Imagen/PDF'}
                  </button>
                </div>
                {!editingId && <p className="col-span-2 text-[10px] text-gray-500 text-center">Ambos archivos son obligatorios para crear un nuevo registro.</p>}
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Experiencia"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}