import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * The device frame every screen lives inside.
 *
 * Figma draws the phone at 360x768 with a 44px radius, a 1px #1E190F @9%
 * hairline and a two-part drop shadow; the dynamic island is a 104x28 pill at
 * [128,12]. On a real handset the chrome is dropped and the app fills the
 * viewport — the 360x768 canvas is a desktop presentation device, not a
 * layout constraint the content should depend on.
 */
export function PhoneShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'device-frame relative isolate overflow-hidden bg-bg',
        'transition-colors duration-350 ease-figma',
        className,
      )}
    >
      {/* Dynamic island — above the status bar, below any overlay. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-1/2 z-30 h-7 w-[104px] -translate-x-1/2 rounded-2xl bg-surface-darker"
      />
      {children}
    </div>
  )
}
