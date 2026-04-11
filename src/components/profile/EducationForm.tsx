import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { GraduationCap, Plus, Edit2, Trash2, X, Loader2, Calendar, BookOpen, Link as LinkIcon, Image as ImageIcon, ChevronDown, School } from "lucide-react";

// 1. Interfaz de los datos que vienen del Backend
export interface AcademicData {
  id?: number;
  academicrecordsId?: number; // Para coincidir con el ID de la DB
  institution: string;
  title: string;
  typeEducation: string;
  startYear: string; 
  endYear?: string;   
  gradePointAverage?: number;
  inProgress: boolean;
  isVisible: boolean;
  honors?: string;
  verificationUrl?: string;
}

// 2. Interfaz de Props (Sincronizada con ProfileEditForm)
interface EducationFormProps { 
  profileId?: string | number; 
  isEditingProfile?: boolean;
}

export function EducationForm({ profileId, isEditingProfile = true }: EducationFormProps) {
  const [records, setRecords] = useState<AcademicData[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string>("");
  const [showAdditional, setShowAdditional] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<AcademicData>({
    institution: "", title: "", typeEducation: "", startYear: "", endYear: "", 
    inProgress: false, isVisible: true, gradePointAverage: 0, honors: "", verificationUrl: ""
  });

  // 3. EFECTO DE CARGA: Se dispara cuando el componente se monta o el profileId cambia
  useEffect(() => {
    if (profileId) {
      fetchRecords();
    }
  }, [profileId]);

  const fetchRecords = async () => {
    setIsLoadingList(true);
    try {
      // Llamada al endpoint que creamos en Spring Boot
      const res = await fetch(`/api/profile/${profileId}/academic-records`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Error al obtener registros academicos:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleOpenModal = (rec?: AcademicData) => {
    setError("");
    setLogoFile(null);
    setCertFile(null);
    setShowAdditional(false);

    if (rec) {
      setFormData({ 
        ...rec, 
        endYear: rec.endYear || "", 
        verificationUrl: rec.verificationUrl || "", 
        honors: rec.honors || "" 
      });
      setEditingId(rec.academicrecordsId || rec.id || null);
    } else {
      setFormData({ institution: "", title: "", typeEducation: "", startYear: "", endYear: "", inProgress: false, isVisible: true, gradePointAverage: 0, honors: "", verificationUrl: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ 
        ...prev, 
        [name]: checked, 
        ...(name === 'inProgress' && checked ? { endYear: "" } : {}) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return alert("Error: ID de perfil no encontrado");

    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(formData));
      if (logoFile) formDataToSend.append('logo', logoFile);
      if (certFile) formDataToSend.append('certificate', certFile);

      const url = editingId 
        ? `/api/profile/${profileId}/academic-records/${editingId}`
        : `/api/profile/${profileId}/academic-records`;

      const res = await fetch(url, { 
        method: editingId ? 'PUT' : 'POST', 
        body: formDataToSend 
      });

      if (!res.ok) throw new Error("Error en el servidor");
      
      await fetchRecords(); // Recargar la lista despues de guardar
      setIsModalOpen(false);
    } catch (err) {
      alert("No se pudo guardar la informacion academica.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estas seguro de que deseas eliminar este estudio?")) return;
    try {
      const res = await fetch(`/api/profile/${profileId}/academic-records/${id}`, { method: 'DELETE' });
      if (res.ok) await fetchRecords();
    } catch (err) {
      alert("Error al eliminar el registro.");
    }
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm text-left mb-6 transition-colors ${isEditingProfile ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-gray-200'}`}>
      
      {/* HEADER DE LA SECCION */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" /> Formacion Academica
        </h3>
        {isEditingProfile && (
          <button onClick={() => handleOpenModal()} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200">
            <Plus className="w-4 h-4" /> Anadir
          </button>
        )}
      </div>

      {/* LISTA DE REGISTROS (LO QUE ESTA EN LA DB) */}
      <div className="p-6">
        {isLoadingList ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
        ) : records.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-4">No se encontraron registros academicos en tu perfil.</p>
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.academicrecordsId || rec.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-indigo-50/30 transition-all group">
                <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{rec.title}</h4>
                    <p className="text-sm font-medium text-indigo-600">{rec.institution}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {rec.startYear} - {rec.inProgress ? "Actualidad" : rec.endYear}
                      </p>
                      {rec.gradePointAverage && (
                        <span className="text-xs font-bold text-gray-400">- Promedio: {rec.gradePointAverage}</span>
                      )}
                    </div>
                  </div>
                  
                  {isEditingProfile && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(rec)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(rec.academicrecordsId || rec.id!)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EL MODAL DEBE QUEDAR IGUAL AL QUE TENIAMOS SEGUN TU IMAGEN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
             {/* ... (Todo el contenido del formulario que ya definimos arriba) ... */}
             <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl"><GraduationCap className="w-6 h-6 text-indigo-600" /></div>
                    <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Editar' : 'Anadir'} Educacion</h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSave} className="space-y-5 text-left">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="inProgress" checked={formData.inProgress} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">Actualmente cursando</span>
                  </label>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Titulo o Certificado *</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Institucion *</label>
                    <input required type="text" name="institution" value={formData.institution} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inicio</label>
                      <input required type="date" name="startYear" value={formData.startYear} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fin</label>
                      <input disabled={formData.inProgress} type="date" name="endYear" value={formData.endYear} onChange={handleChange} className="w-full px-4 py-2 border rounded-xl disabled:bg-gray-50" />
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button type="button" onClick={() => setShowAdditional(!showAdditional)} className="w-full px-5 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-gray-700">Detalles adicionales</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showAdditional ? 'rotate-180' : ''}`} />
                    </button>
                    {showAdditional && (
                      <div className="p-5 bg-gray-50/50 border-t border-gray-100 space-y-4">
                        <input type="number" step="0.01" name="gradePointAverage" value={formData.gradePointAverage} onChange={handleChange} placeholder="Promedio (GPA)" className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" name="honors" value={formData.honors} onChange={handleChange} placeholder="Honores" className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    )}
                  </div>

                  {/* Subida de Archivos */}
                  <div className="space-y-3">
                    <div onClick={() => certInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-1 cursor-pointer hover:bg-indigo-50 transition-all">
                      <input type="file" ref={certInputRef} className="hidden" accept="image/*" onChange={(e) => setCertFile(e.target.files?.[0] || null)} />
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-600">{certFile ? certFile.name : 'Subir certificado'}</p>
                    </div>
                    <div onClick={() => logoInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-1 cursor-pointer hover:bg-indigo-50 transition-all">
                      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
                      <School className="w-6 h-6 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-600">{logoFile ? logoFile.name : 'Subir logo'}</p>
                    </div>
                  </div>

                  <button type="submit" disabled={isSaving} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Educacion"}
                  </button>
                </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
