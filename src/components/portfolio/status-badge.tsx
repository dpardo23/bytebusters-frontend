import { Circle } from "lucide-react"

interface StatusBadgeProps {
  status?: string;
  lastActive?: string;
}

function getTimeAgo(dateString: string): string {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "hace unos segundos";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours} horas`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays} días`;
}

export function StatusBadge({ status = "active", lastActive }: StatusBadgeProps) {
  let bgColor, textColor, borderColor, labelText;
  
  const timeText = lastActive ? ` • ${getTimeAgo(lastActive)}` : "";

  switch (status) {
    case 'active':
      bgColor = "bg-green-50";
      textColor = "text-green-600";
      borderColor = "border-green-200";
      labelText = `Disponible para contratar${timeText}`;
      break;
    case 'busy':
      bgColor = "bg-amber-50";
      textColor = "text-amber-600";
      borderColor = "border-amber-200";
      labelText = `Trabajando actualmente${timeText}`;
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
      labelText = `Disponible para contratar${timeText}`;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bgColor} ${borderColor} shadow-sm transition-colors`}>
      <Circle className={`w-2 h-2 fill-current ${textColor}`} />
      <span className="text-gray-700">{labelText}</span>
    </div>
  )
}