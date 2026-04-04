import { useState } from "react";
import { GraduationCap } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setEduData(prev => ({ ...prev, isCurrent: checked, endDate: checked ? "" : prev.endDate }));
    } else {
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
        <div className="flex gap-4">
          <div className="w-full space-y-1">
            <label className="block text-xs text-gray-500 font-medium">Fecha de inicio</label>
            <input
              type="date"
              name="startDate"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md outline-none"
            />
          </div>
          <div className="w-full space-y-1">
            <label className="block text-xs text-gray-500 font-medium">Fecha de fin</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              disabled={eduData.isCurrent}
              className={`w-full px-3 py-2 border rounded-md outline-none
                ${!eduData.startDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}
                ${eduData.isCurrent ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}