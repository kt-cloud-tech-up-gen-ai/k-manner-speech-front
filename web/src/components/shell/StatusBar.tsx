import { cn } from '@/lib/cn'

/**
 * P01–P14 all carry the same status bar: 50px tall, contents bottom-aligned,
 * 26px side padding, Space Grotesk. The dynamic island is drawn by PhoneShell
 * so it can sit above scrolling content.
 */
export function StatusBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const ink = tone === 'dark' ? 'text-ink' : 'text-white'
  const stroke = tone === 'dark' ? 'stroke-ink' : 'stroke-white'
  const fill = tone === 'dark' ? 'fill-ink' : 'fill-white'

  return (
    <div
      className={cn(
        'relative z-20 flex h-[50px] shrink-0 items-end justify-between px-[26px] pb-1.5',
        ink,
      )}
    >
      <span className="font-mono text-[13px] leading-tight font-bold">9:41</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[11px] leading-tight font-bold">5G</span>
        <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden="true">
          <rect
            x="0.5"
            y="0.5"
            width="19"
            height="10"
            rx="3"
            className={cn('fill-none', stroke)}
            strokeWidth="1"
          />
          <rect x="2" y="3" width="12" height="5" rx="1" className={fill} />
          <path
            d="M20.6 4v3a1.6 1.6 0 0 0 0-3Z"
            className={cn(fill, 'opacity-40')}
          />
        </svg>
      </div>
    </div>
  )
}
