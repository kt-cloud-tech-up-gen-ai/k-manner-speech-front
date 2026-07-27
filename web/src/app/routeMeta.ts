export interface RouteMeta {
  /** Bottom tab bar is only on 홈 / 연습 / 내정보 and their list screens. */
  tabBar: boolean
  /** Splash puts white glyphs on the blue field. */
  statusTone: 'dark' | 'light'
  /** Background applied to the device frame itself, behind the status bar. */
  shellClass?: string
  /** Screens the prototype wires with DISSOLVE rather than PUSH. */
  transition: 'push' | 'dissolve'
}

const RULES: Array<[RegExp, RouteMeta]> = [
  [
    /^\/splash$/,
    {
      tabBar: false,
      statusTone: 'light',
      shellClass: 'bg-primary-splash',
      transition: 'dissolve',
    },
  ],
  [/^\/onboarding\//, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/trial/, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/home/, { tabBar: true, statusTone: 'dark', transition: 'push' }],
  [/^\/personas/, { tabBar: true, statusTone: 'dark', transition: 'push' }],
  [/^\/simulation/, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/result/, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/settings$/, { tabBar: true, statusTone: 'dark', transition: 'push' }],
  [/^\/settings\//, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/profile/, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/legal/, { tabBar: false, statusTone: 'dark', transition: 'push' }],
  [/^\/login/, { tabBar: false, statusTone: 'dark', transition: 'push' }],
]

const DEFAULT: RouteMeta = { tabBar: false, statusTone: 'dark', transition: 'push' }

export function routeMeta(pathname: string): RouteMeta {
  for (const [re, meta] of RULES) if (re.test(pathname)) return meta
  return DEFAULT
}
