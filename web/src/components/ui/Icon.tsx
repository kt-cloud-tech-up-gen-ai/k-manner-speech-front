import type { SVGProps } from 'react'

export type IconName =
  | 'home'
  | 'practice'
  | 'profile'
  | 'search'
  | 'mic'
  | 'send'
  | 'plus'
  | 'chevron-right'
  | 'lock'
  | 'check'
  | 'close'
  | 'play'

type Props = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
  /** Stroke width for the line icons. The design uses ~1.7px at 21px. */
  weight?: number
}

/**
 * Line icons matching the Figma vector strokes. Every stroked path uses
 * `currentColor` so callers set colour with a text-* class, the way the
 * design switches nav icons between #385DB8 (active) and #B4AC9B (inactive).
 */
export function Icon({ name, size = 21, weight = 1.7, ...rest }: Props) {
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: weight,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {name === 'home' && (
        <>
          <path d="M3.4 8.6 10.5 3l7.1 5.6" {...stroke} />
          <path d="M5.2 9.9v7.2h10.6V9.9" {...stroke} />
        </>
      )}
      {name === 'practice' && (
        <>
          <rect x="4.6" y="2.8" width="11.8" height="15.4" rx="2.4" {...stroke} />
          <path d="M7.6 7.2h6M7.6 10.5h6M7.6 13.8h3.6" {...stroke} />
        </>
      )}
      {name === 'profile' && (
        <>
          <circle cx="10.5" cy="7" r="3.2" {...stroke} />
          <path d="M4.4 17.6c0-3.3 2.7-5.4 6.1-5.4s6.1 2.1 6.1 5.4" {...stroke} />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="9.3" cy="9.3" r="5.4" {...stroke} />
          <path d="m13.4 13.4 3.5 3.5" {...stroke} />
        </>
      )}
      {name === 'mic' && (
        <>
          <rect x="7.9" y="2.4" width="5.2" height="9.4" rx="2.6" fill="currentColor" />
          <path d="M4.9 9.6a5.6 5.6 0 0 0 11.2 0" {...stroke} />
          <path d="M10.5 15.2v3.2M7.6 18.4h5.8" {...stroke} />
        </>
      )}
      {name === 'send' && <path d="M4 2.5 18 10.5 4 18.5V12l8-1.5L4 9Z" fill="currentColor" />}
      {name === 'plus' && <path d="M10.5 4.9v11.2M4.9 10.5h11.2" {...stroke} />}
      {name === 'chevron-right' && <path d="M8 3.6l6.8 6.9L8 17.4" {...stroke} />}
      {name === 'lock' && (
        <>
          <path
            d="M7.2 8.8V6.5a3.3 3.3 0 0 1 6.6 0v2.3"
            fill="none"
            stroke="currentColor"
            strokeWidth={weight * 0.75}
          />
          <rect x="4.9" y="8.8" width="11.2" height="8.2" rx="2.2" fill="currentColor" />
        </>
      )}
      {name === 'check' && <path d="m4.9 10.9 3.7 3.7 7.5-8.2" {...stroke} />}
      {name === 'close' && <path d="m5.6 5.6 9.8 9.8M15.4 5.6l-9.8 9.8" {...stroke} />}
      {name === 'play' && <path d="M7 4.6 16 10.5 7 16.4Z" {...stroke} />}
    </svg>
  )
}
