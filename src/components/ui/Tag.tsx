type TagVariant = 'filled' | 'outline-dark' | 'outline-light'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<TagVariant, string> = {
  filled:
    'bg-orange text-white',
  'outline-dark':
    'border border-dark-border text-[#555]',
  'outline-light':
    'border border-[#ccc] text-[#aaa]',
}

export function Tag({
  variant = 'filled',
  children,
  className = '',
}: TagProps) {
  return (
    <span
      className={`font-mono text-[9px] tracking-[1.5px] uppercase px-[10px] py-[5px] rounded-[2px] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
