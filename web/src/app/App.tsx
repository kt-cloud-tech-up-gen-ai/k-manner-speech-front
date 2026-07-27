import { useRef } from 'react'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'

import { PhoneShell } from '@/components/shell/PhoneShell'
import { StatusBar } from '@/components/shell/StatusBar'
import { TabBar } from '@/components/shell/TabBar'
import { T, dissolveVariants, pushVariants, routeDepth } from '@/lib/motion'
import { routeMeta } from './routeMeta'

import { SplashScreen } from '@/features/splash/SplashScreen'
import { LanguageScreen } from '@/features/onboarding/LanguageScreen'
import { PurposeScreen } from '@/features/onboarding/PurposeScreen'
import { PaceScreen } from '@/features/onboarding/PaceScreen'
import { NotificationsScreen } from '@/features/onboarding/NotificationsScreen'
import { TrialScreen } from '@/features/trial/TrialScreen'
import { HomeScreen } from '@/features/home/HomeScreen'
import { PersonasScreen } from '@/features/personas/PersonasScreen'
import { ScenariosScreen } from '@/features/personas/ScenariosScreen'
import { SimulationScreen } from '@/features/simulation/SimulationScreen'
import { ResultScreen } from '@/features/simulation/ResultScreen'
import { LoginScreen } from '@/features/auth/LoginScreen'
import { ProfileScreen } from '@/features/profile/ProfileScreen'
import { SettingsScreen } from '@/features/settings/SettingsScreen'
import { StudyPurposeScreen } from '@/features/settings/StudyPurposeScreen'
import { StudyPaceScreen } from '@/features/settings/StudyPaceScreen'
import { LegalScreen } from '@/features/legal/LegalScreen'

function AppFrame() {
  const location = useLocation()
  const meta = routeMeta(location.pathname)

  const depth = routeDepth(location.pathname)
  const previousDepth = useRef(depth)
  const direction = depth >= previousDepth.current ? 1 : -1
  previousDepth.current = depth

  const isPush = meta.transition === 'push'

  return (
    <PhoneShell className={meta.shellClass}>
      <StatusBar tone={meta.statusTone} />

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="sync">
          {/* Keyed on pathname, and `location` is captured in the element so
              the exiting copy keeps rendering the screen it was showing. */}
          <motion.div
            key={location.pathname}
            custom={direction}
            variants={isPush ? pushVariants : dissolveVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={isPush ? (direction >= 0 ? T.push : T.back) : T.dissolve}
            className="absolute inset-0 flex flex-col"
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/splash" replace />} />
              <Route path="/splash" element={<SplashScreen />} />

              <Route path="/onboarding/language" element={<LanguageScreen />} />
              <Route path="/onboarding/purpose" element={<PurposeScreen />} />
              <Route path="/onboarding/pace" element={<PaceScreen />} />
              <Route
                path="/onboarding/notifications"
                element={<NotificationsScreen />}
              />

              <Route path="/trial" element={<TrialScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/personas" element={<PersonasScreen />} />
              <Route path="/personas/:personaId" element={<ScenariosScreen />} />
              <Route path="/simulation/:scenarioId" element={<SimulationScreen />} />
              <Route path="/result/:scenarioId" element={<ResultScreen />} />

              <Route path="/login" element={<LoginScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/settings/purpose" element={<StudyPurposeScreen />} />
              <Route path="/settings/pace" element={<StudyPaceScreen />} />
              <Route path="/legal" element={<LegalScreen />} />

              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      {meta.tabBar && <TabBar />}
    </PhoneShell>
  )
}

export function App() {
  return (
    // The CSS `prefers-reduced-motion` block only reaches CSS transitions;
    // every motion.* animation is inline style written from JS, so the
    // preference has to be handed to Motion explicitly.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppFrame />
      </BrowserRouter>
    </MotionConfig>
  )
}
