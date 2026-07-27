import type { Decorator } from '@storybook/react-vite'

/**
 * Components are laid out against the 360px device width. Rendering them in an
 * unbounded canvas makes full-width CTAs and grids look nothing like the
 * design, so stories pin the width by default.
 */
export const phoneWidth: Decorator = (Story) => (
  <div className="w-[360px] bg-bg p-[22px]">
    <Story />
  </div>
)

/** For rows and bars that already own their horizontal padding. */
export const phoneBleed: Decorator = (Story) => (
  <div className="w-[360px] bg-bg">
    <Story />
  </div>
)

/**
 * Full 360x768 canvas for overlays — dialogs and sheets position themselves
 * against `absolute inset-0`, so they need a positioned box the right size.
 */
export const phoneScreen: Decorator = (Story) => (
  <div className="relative h-[768px] w-[360px] overflow-hidden rounded-device border border-line-device bg-bg shadow-device">
    <Story />
  </div>
)

/** Labelled row so a story can show several states side by side. */
export function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] tracking-[0.08em] text-muted uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

export function Stack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>
}
