import type { ComponentProps, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'

export type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'soft'
export type ButtonShape = 'rounded' | 'pill'
export type ButtonSize = 'sm' | 'md' | 'lg'

type Props = Omit<ComponentProps<typeof motion.button>, 'children'> & {
  variant?: ButtonVariant
  /** `pill` is the 27px-radius CTA used by the Noto-set sheets and P02L. */
  shape?: ButtonShape
  size?: ButtonSize
  /** Off for side-by-side pairs like P10's 다시 하기 / 다음 시나리오. */
  fullWidth?: boolean
  /** The primary CTA carries a blue glow everywhere except inside a card. */
  elevated?: boolean
  children: ReactNode
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-11 text-base',
  md: 'h-[46px] text-base',
  lg: 'h-[54px] text-md',
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-strong',
  ghost: 'text-ink-4 hover:bg-surface-sunken',
  outline: 'border border-line bg-surface text-ink-4 hover:bg-surface-sunken',
  // The 건너뛰기 / 이어하기 shape: a filled neutral surface, no hairline.
  soft: 'bg-surface-sunken text-ink-3 hover:bg-surface-sunken/70',
}

/**
 * Every CTA in the design reduces to variant x shape x size. The Figma frames
 * use `rounded` (13-15px radius, Inter) on the Inter-set screens and `pill`
 * (fully rounded, Noto Sans KR) on P02L, the language picker and the home
 * tutorial sheets — hence `shape` rather than two components.
 */
export function Button({
  variant = 'primary',
  shape = 'rounded',
  size = 'lg',
  fullWidth = true,
  elevated,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  const glow = elevated ?? variant === 'primary'

  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: PRESS.button }}
      transition={T.instant}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center text-center font-semibold',
        'transition-colors duration-200 ease-figma outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary/40',
        fullWidth && 'w-full',
        shape === 'pill' ? 'rounded-full' : 'rounded-xl',
        SIZES[size],
        VARIANTS[variant],
        glow && variant === 'primary' && 'shadow-cta',
        // The design has no disabled state; a neutral surface reads as
        // "not yet" far better than a washed-out primary.
        disabled &&
          'pointer-events-none border border-line !bg-surface-sunken !text-muted shadow-none',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
