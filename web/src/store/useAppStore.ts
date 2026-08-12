import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Gender, Locale } from '@/api/types'

/**
 * Onboarding is one linear wizard (언어 → 목적 → 빈도 → 알림) whose steps share
 * state, so it lives in a single store rather than being threaded through
 * router state. Account and settings flags sit alongside it because the
 * screens branch on them (P13 vs P13A guest, P13B notifications off).
 */
interface AppState {
  // -- onboarding -----------------------------------------------------------
  locale: Locale
  purposes: string[]
  purposeOther: string
  pace: string | null
  notificationsAllowed: boolean
  onboardingComplete: boolean
  tutorialSeen: boolean

  // -- account --------------------------------------------------------------
  signedIn: boolean
  profile: { name: string; gender: Gender; age: number }

  setLocale: (locale: Locale) => void
  togglePurpose: (id: string) => void
  setPurposeOther: (text: string) => void
  setPace: (id: string) => void
  setNotifications: (allowed: boolean) => void
  completeOnboarding: () => void
  markTutorialSeen: () => void
  signIn: () => void
  signOut: () => void
  updateProfile: (patch: Partial<AppState['profile']>) => void
  reset: () => void
}

const INITIAL = {
  locale: 'ko' as Locale,
  purposes: [] as string[],
  purposeOther: '',
  pace: null as string | null,
  notificationsAllowed: true,
  onboardingComplete: false,
  tutorialSeen: false,
  signedIn: false,
  profile: { name: 'Emma Wilson', gender: 'female' as Gender, age: 24 },
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...INITIAL,

      setLocale: (locale) => set({ locale }),

      togglePurpose: (id) =>
        set((s) => ({
          purposes: s.purposes.includes(id)
            ? s.purposes.filter((p) => p !== id)
            : [...s.purposes, id],
        })),

      setPurposeOther: (purposeOther) => set({ purposeOther }),
      setPace: (pace) => set({ pace }),
      setNotifications: (notificationsAllowed) => set({ notificationsAllowed }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      markTutorialSeen: () => set({ tutorialSeen: true }),
      signIn: () => set({ signedIn: true }),
      signOut: () => set({ signedIn: false }),

      updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      reset: () => set({ ...INITIAL }),
    }),
    {
      name: 'k-manner-speech',
      // 로그인 여부의 원본은 서버의 HttpOnly 세션 쿠키다. 브라우저 저장소에 남은
      // signedIn=true를 복원하면 만료된 세션도 로그인처럼 보이므로 항상 false로 시작해
      // App의 /auth/me 확인 결과로만 다시 true가 되게 한다.
      merge: (persisted, current) => ({
        ...current,
        ...(persisted as Partial<AppState>),
        signedIn: false,
      }),
    },
  ),
)
