import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { EASE_OUT, T } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

const HOLD_MS = 1800

/**
 * P01 · Splash — mobile only.
 *
 * The prototype wires this to the language screen on AFTER_TIMEOUT with a
 * 350ms DISSOLVE; the frame's own type is Noto Sans KR rather than Inter.
 */
export function SplashScreen() {
  const navigate = useNavigate()
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)

  useEffect(() => {
    const id = setTimeout(() => {
      navigate(onboardingComplete ? '/home' : '/onboarding/language', {
        replace: true,
      })
    }, HOLD_MS)
    return () => clearTimeout(id)
  }, [navigate, onboardingComplete])

  return (
    <div className="font-splash flex h-full flex-col items-center bg-primary-splash text-white">
      <motion.div
        className="mt-[196px] flex flex-col items-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        <motion.div
          className="flex h-[82px] w-[82px] items-center justify-center rounded-[24px] border border-white bg-primary-splash-tile"
          initial={{ scale: 0.86 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <span className="text-splash-mark font-bold">K</span>
        </motion.div>

        <h1 className="text-splash mt-[37px] font-bold">K-Manner Speech</h1>
        <p className="mt-[9px] text-[14px] leading-[20px]">상황에 맞는 말, 자연스럽게</p>
        <p className="mt-[8px] text-[11px] leading-[16px] text-[#D4DEFF]">
          Speak Korean that fits the moment
        </p>
      </motion.div>

      <div className="mt-auto mb-[39px] flex flex-col items-center gap-[18px]">
        <div className="flex gap-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-[9px] w-[9px] rounded-full bg-white"
              animate={{ opacity: [1, 0.45, 1] }}
              transition={{
                duration: 1.1,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: i * 0.16,
              }}
            />
          ))}
        </div>
        <motion.span
          className="text-[10px] leading-[14px] font-medium tracking-[0.08em] text-[#C7D4FF]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={T.dissolve}
        >
          LOADING
        </motion.span>
      </div>
    </div>
  )
}
