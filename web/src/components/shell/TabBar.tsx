import { Link, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { T } from '@/lib/motion'

const TABS: Array<{ to: string; label: string; icon: IconName; match: RegExp }> = [
  { to: '/home', label: '홈', icon: 'home', match: /^\/home/ },
  { to: '/personas', label: '연습', icon: 'practice', match: /^\/(personas|simulation)/ },
  { to: '/settings', label: '내정보', icon: 'profile', match: /^\/(settings|profile|legal)/ },
]

/**
 * 66px bar pinned to the bottom of the phone, present on P06/P07/P08/P13.
 * Active tint #385DB8, inactive icon #B4AC9B with #A29A89 label.
 */
export function TabBar() {
  const { pathname } = useLocation()

  return (
    <nav className="relative z-20 flex h-[66px] shrink-0 items-stretch border-t border-line-soft bg-surface">
      {TABS.map((tab) => {
        const active = tab.match.test(pathname)
        return (
          <Link
            key={tab.to}
            to={tab.to}
            aria-current={active ? 'page' : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-[5px] outline-none focus-visible:opacity-70"
          >
            <motion.span
              animate={{ scale: active ? 1 : 0.94 }}
              transition={T.instant}
              className={cn(
                'block transition-colors duration-200 ease-figma',
                active ? 'text-primary-strong' : 'text-muted-3',
              )}
            >
              <Icon name={tab.icon} size={21} weight={1.7} />
            </motion.span>
            <span
              className={cn(
                'text-2xs transition-colors duration-200 ease-figma',
                active ? 'font-semibold text-primary-strong' : 'font-medium text-muted',
              )}
            >
              {tab.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
