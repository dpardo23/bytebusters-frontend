import { Briefcase, Calendar, MapPin } from "lucide-react"

export interface ExperienceData {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceSectionProps {
  experiences: ExperienceData[];
  isGuest?: boolean;
}

export function ExperienceSection({ experiences, isGuest = false }: ExperienceSectionProps) {
  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-left">

        <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Experiencia Laboral</h3>
        </div>

        <div className="p-6">
          {experiences && experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`relative pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-[-32px] before:w-[2px] before:bg-gray-200 last:before:hidden
                    ${isGuest && index >= 2 ? "blur-sm select-none opacity-50" : ""}`}
                >
                  <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>

                  <div className="mb-1">
                    <h4 className="text-md font-bold text-gray-900">{exp.role}</h4>
                    <p className="text-sm font-semibold text-blue-600">{exp.company}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {exp.startDate} - {exp.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {exp.location}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">Aún no hay experiencia laboral registrada.</p>
          )}
        </div>
      </div>
    </div>
  )
}