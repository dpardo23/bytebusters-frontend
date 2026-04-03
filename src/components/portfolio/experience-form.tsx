import { useState } from "react";
import { Briefcase } from "lucide-react";

interface ExperienceData {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  isFreelance: boolean;
}

export function ExperienceForm() {
  const [expData, setExpData] = useState<ExperienceData>({
    role: "", company: "", startDate: "", endDate: "", isFreelance: false
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setExpData(prev => ({ ...prev, [name]: newValue }));

    if (name === "endDate" && expData.startDate) {
      if (new Date(value) < new Date(expData.startDate)) {
        setError("La fecha final no puede ser anterior a la fecha de inicio.");
      } else setError("");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 text-left overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" /> Añadir Experiencia
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <input
            type="checkbox"
            name="isFreelance"
            checked={expData.isFreelance}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />
          <span className="text-sm text-gray-700 font-medium">Proyecto Freelance / Independiente</span>
        </label>
        <input
          type="text"
          name="role"
          placeholder="Cargo o Rol"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md outline-none"
        />
        <input
          type="text"
          name="company"
          placeholder="Empresa"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md outline-none"
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
            <label className="block text-xs text-gray-500 font-medium">Fecha final</label>
            <input
              type="date"
              name="endDate"
              onChange={handleChange}
              disabled={!expData.startDate}
              className={`w-full px-3 py-2 border rounded-md outline-none
                ${error ? "border-red-500" : ""}
                ${!expData.startDate ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            {!expData.startDate && (
              <p className="text-xs text-gray-400 mt-1">Primero selecciona la fecha de inicio.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}