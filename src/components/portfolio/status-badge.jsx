import { Circle } from "lucide-react"

export function StatusBadge({ status = "active" }) {
  
  let bgColor, textColor, borderColor, labelText;

  switch (status) {
    case 'active':
      bgColor = "bg-green-50";
      textColor = "text-green-600";
      borderColor = "border-green-200";
      labelText = "Disponible para contratar";
      break;
    case 'busy':
      bgColor = "bg-amber-50";
      textColor = "text-amber-600";
      borderColor = "border-amber-200";
      labelText = "Trabajando actualmente";
      break;
    case 'incognito':
      bgColor = "bg-gray-50";
      textColor = "text-gray-600";
      borderColor = "border-gray-200";
      labelText = "No disponible";
      break;
    default:
      bgColor = "bg-green-50";
      textColor = "text-green-600";
      borderColor = "border-green-200";
      labelText = "Disponible para contratar";
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bgColor} ${borderColor} shadow-sm transition-colors`}>
      <Circle className={`w-2 h-2 fill-current ${textColor}`} />
      <span className="text-gray-700">{labelText}</span>
    </div>
  )
}