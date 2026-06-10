import Link from 'next/link'

type ButtonVariant = 'primary' | 'ghost' | 'cta'

interface ButtonProps {
  variant?: ButtonVariant
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-orange text-white font-body font-bold text-[11px] tracking-[1.5px] uppercase px-7 py-[14px] rounded-[2px] hover:opacity-85 transition-opacity',
  ghost:
    'border border-dark-border text-[#666] font-body text-[11px] tracking-[1.5px] uppercase px-7 py-[14px] rounded-[2px] hover:border-[#555] hover:text-[#aaa] transition-colors',
  cta:
    'bg-orange text-white font-body font-bold text-[11px] tracking-[1.5px] uppercase px-5 py-[10px] rounded-[2px] hover:opacity-85 transition-opacity',
}

export function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className = '',
}: ButtonProps) {
  const cls = `inline-block ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
