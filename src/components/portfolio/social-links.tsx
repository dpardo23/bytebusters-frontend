import { Code, Briefcase, Globe } from "lucide-react"

interface SocialLinksProps {
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export function SocialLinks({ githubUrl, linkedinUrl, websiteUrl }: SocialLinksProps) {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Code className="w-4 h-4 mr-2" /> GitHub
        </a>
      )}
      {linkedinUrl && (
        <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Briefcase className="w-4 h-4 mr-2" /> LinkedIn
        </a>
      )}
      {websiteUrl && (
        <a href={websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <Globe className="w-4 h-4 mr-2" /> Web
        </a>
      )}
    </div>
  )
}