import { BookOpen, Calendar, GraduationCap } from "lucide-react";

export interface EducationData {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

interface EducationSectionProps {
  education: EducationData[];
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
                    <h4 className="font-bold text-gray-900 leading-tight">{edu.degree}</h4>
                    <p className="text-sm font-medium text-blue-600 mb-2">{edu.school}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.startDate} — {edu.isCurrent ? "Presente" : edu.endDate}
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
