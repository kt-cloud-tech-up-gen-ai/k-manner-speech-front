import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * The scrollable body between the status bar and the tab bar.
 * `min-h-0` is what lets it actually scroll inside the flex column.
 */
export function ScreenBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'scrollbar-none flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}
