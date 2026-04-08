export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 ${className}`}
      {...props}
    />
  )
}