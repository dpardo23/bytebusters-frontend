import React, { useState, useEffect, FormEvent } from 'react';
import { BookOpen, Calendar, GraduationCap, Trash2, Edit2, Plus, Loader2 } from "lucide-react";

// ----------------------------------------------------------------------
// INTERFAZ UNIFICADA
// ----------------------------------------------------------------------
export interface AcademicRecord {
  id?: number;
  institution: string;
  title: string;
  startYear: string;
  endYear: string | null;
  inProgress: boolean;
  typeEducation: string;
}

// ======================================================================
// 1. COMPONENTE DE VISUALIZACIÓN PÚBLICA (Tu diseño original)
// ======================================================================
interface EducationSectionProps {
  education: AcademicRecord[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Educación</h3>
        </div>
        <div className="p-6">
          {education && education.length > 0 ? (
            <div className="grid gap-6">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-50 hover:bg-blue-50/30 transition-colors"
                >
                  <div className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                    <GraduationCap className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{edu.title}</h4>
                    <p className="text-sm font-medium text-blue-600 mb-2">{edu.institution}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.startYear ? edu.startYear.split('-')[0] : ''} — {edu.inProgress ? "Presente" : (edu.endYear ? edu.endYear.split('-')[0] : '')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Sin registros académicos.</p>
          )}
        </div>
      </div>
    </div>
  );
}


// ======================================================================
// 2. COMPONENTE DE EDICIÓN (CRUD PARA EL BACKEND)
// ======================================================================

// NUEVO: Le decimos a TypeScript que este componente recibe esta prop
interface EducationFormProps {
  isEditingProfile?: boolean;
}

export function EducationForm({ isEditingProfile = true }: EducationFormProps) {
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AcademicRecord>({
    institution: '',
    title: '',
    startYear: '',
    endYear: '',
    inProgress: false,
    typeEducation: 'UNIVERSITY'
  });

  useEffect(() => {
    fetch('/api/academic-records/1') 
      .then(res => res.json())
      .then(data => {
        console.log("DATOS RECIBIDOS DE EDUCACION:", data); // <--- AGREGAR ESTO
        setRecords(data);
        setIsLoading(false);
      })
      .catch((error) => {
         console.error("Error cargando educación:", error); // <--- AGREGAR ESTO
         setIsLoading(false);
      });
  }, []);

  const resetForm = () => {
    setForm({ institution: '', title: '', startYear: '', endYear: '', inProgress: false, typeEducation: 'UNIVERSITY' });
    setEditingId(null);
  };

  const handleEdit = (record: AcademicRecord) => {
    setForm({
      ...record,
      startYear: record.startYear ? record.startYear.split('T')[0] : '',
      endYear: record.endYear ? record.endYear.split('T')[0] : ''
    });
    setEditingId(record.id!);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este hito académico? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await fetch(`/api/academic-records/${id}`, { method: 'DELETE' });
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      alert("Error al eliminar el registro");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const endpoint = editingId ? `/api/academic-records/${editingId}` : '/api/academic-records';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        const savedRecord = await response.json();
        if (editingId) {
          setRecords(prev => prev.map(r => r.id === editingId ? savedRecord : r));
        } else {
          setRecords(prev => [savedRecord, ...prev]);
        }
        resetForm();
      } else {
         const errorData = await response.json();
         alert(errorData.error || "Error al guardar el registro");
      }
    } catch (error) {
      alert("Error de conexión al guardar el registro académico");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white border rounded-xl shadow-sm overflow-hidden text-left transition-colors ${isEditingProfile ? 'border-blue-200 ring-1 ring-blue-50' : 'border-gray-200'}`}>
      <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Educación</h3>
      </div>

      <div className="p-6">
        
        {/* SOLO MOSTRAMOS EL FORMULARIO SI ESTAMOS EN MODO EDICIÓN */}
        {isEditingProfile && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4 shadow-sm">
            <h4 className="font-medium text-gray-800 border-b pb-2 mb-4">{editingId ? 'Editar Hito Académico' : 'Añadir Nuevo Hito'}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Institución <span className="text-red-500">*</span></label>
                <input required type="text" value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Título Obtenido <span className="text-red-500">*</span></label>
                <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fecha de Inicio <span className="text-red-500">*</span></label>
                <input required type="date" value={form.startYear} onChange={e => setForm({...form, startYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fecha de Finalización</label>
                <input type="date" disabled={form.inProgress} value={form.inProgress ? '' : (form.endYear || '')} onChange={e => setForm({...form, endYear: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 py-2">
              <input type="checkbox" id="inProgress" checked={form.inProgress} onChange={e => setForm({...form, inProgress: e.target.checked})} className="w-4 h-4 text-blue-600 rounded border-gray-300" />
              <label htmlFor="inProgress" className="text-sm font-medium text-gray-700 cursor-pointer">Actualmente estudiando aquí</label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors">Cancelar</button>
              )}
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                {editingId ? 'Guardar Cambios' : 'Añadir Hito'}
              </button>
            </div>
          </form>
        )}

        {/* LISTA DE REGISTROS */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
             <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
             <span className="text-sm">Cargando educación...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
             Aún no has agregado información académica a tu perfil.
          </div>
        ) : (
          <div className="space-y-3">
            {isEditingProfile && <h4 className="font-medium text-gray-800 mb-3">Tus Registros Actuales</h4>}
            {records.map(record => (
              <div key={record.id} className="flex justify-between items-center p-4 border border-gray-200 bg-white rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100 hidden sm:block">
                     <GraduationCap className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 leading-snug">{record.title}</h5>
                    <p className="text-sm text-gray-600">{record.institution}</p>
                    <p className="text-xs font-medium text-blue-600 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {record.startYear ? record.startYear.split('-')[0] : ''} - {record.inProgress ? 'Actualidad' : (record.endYear ? record.endYear.split('-')[0] : '')}
                    </p>
                  </div>
                </div>
                
                {/* SOLO MOSTRAMOS LOS BOTONES DE ACCIÓN SI ESTAMOS EN MODO EDICIÓN */}
                {isEditingProfile && (
                  <div className="flex items-center gap-1 ml-4 shrink-0">
                    <button type="button" onClick={() => handleEdit(record)} title="Editar" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => handleDelete(record.id!)} title="Eliminar" className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}