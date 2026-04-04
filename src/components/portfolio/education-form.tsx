import { useState } from "react";
import { GraduationCap, AlertCircle } from "lucide-react";

interface EducationData {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export function EducationForm() {
  const [eduData, setEduData] = useState<EducationData>({
    school: "", degree: "", startDate: "", endDate: "", isCurrent: false
  });

  const [dateError, setDateError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEduData(prev => ({ ...prev, isCurrent: checked, endDate: checked ? "" : prev.endDate }));
      setDateError("");
    } else {
      // Validación: fecha fin no puede ser anterior a fecha inicio
      if (name === "endDate" && eduData.startDate && value) {
        if (new Date(value) < new Date(eduData.startDate)) {
          setDateError("La fecha de fin no puede ser anterior a la de inicio");
        } else {
          setDateError("");
        }
      }

      if (name === "startDate" && eduData.endDate && value) {
        if (new Date(eduData.endDate) < new Date(value)) {
          setDateError("La fecha de fin no puede ser anterior a la de inicio");
        } else {
          setDateError("");
        }
      }

      setEduData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 text-left overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" /> Añadir Educación
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <input
          type="text"
          name="school"
          placeholder="Institución Educativa"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="degree"
          placeholder="Título obtenido"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            name="isCurrent"
            checked={eduData.isCurrent}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">
            Actualmente estudiando aquí
          </span>
        </label>

        <div className="flex gap-4">
          <div className="w-full space-y-1">
            <label className="block text-xs text-gray-500 font-medium">Fecha de inicio</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full space-y-1">
            <label className="block text-xs text-gray-500 font-medium">Fecha final</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              disabled={eduData.isCurrent || !eduData.startDate}
              className={`w-full px-3 py-2 border rounded-md outline-none transition-colors
                ${dateError ? "border-red-500 focus:ring-2 focus:ring-red-500" : "focus:ring-2 focus:ring-blue-500"}
                ${eduData.isCurrent || !eduData.startDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
            />
            {!eduData.startDate && !eduData.isCurrent && (
              <p className="text-xs text-gray-400 mt-1 ml-1">
                Primero selecciona la fecha de inicio
              </p>
            )}
          </div>
        </div>

        {dateError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {dateError}
          </div>
        )}
      </div>
    </div>
  );
}