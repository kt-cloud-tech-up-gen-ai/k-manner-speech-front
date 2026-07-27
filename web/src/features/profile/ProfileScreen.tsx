import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import type { Gender } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { BackButton } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { PRESS, T } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'

const GENDERS: Array<{ id: Gender; label: string }> = [
  { id: 'female', label: '여성' },
  { id: 'male', label: '남성' },
  { id: 'undisclosed', label: '밝히지 않음' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-ink-4">{label}</span>
      {children}
    </div>
  )
}

/** P12 · Profile settings — entered once after login. */
export function ProfileScreen() {
  const navigate = useNavigate()
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)

  const [name, setName] = useState(profile.name)
  const [gender, setGender] = useState<Gender>(profile.gender)
  const [age, setAge] = useState(String(profile.age))

  function save() {
    updateProfile({ name, gender, age: Number(age) || profile.age })
    navigate(-1)
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-[46px] shrink-0 items-center gap-3 px-6 pt-2">
        <BackButton onClick={() => navigate(-1)} bare />
        <h1 className="flex items-baseline gap-1.5">
          <span className="text-[18px] leading-[22px] font-bold text-ink">프로필 설정</span>
          <span className="text-md font-medium text-muted">Profile</span>
        </h1>
      </header>

      <ScreenBody className="px-6">
        <p className="mt-2 text-sm leading-[19.5px] text-muted-2">
          로그인 후 한 번만 입력 · 통계와 맞춤 피드백에 사용돼요
        </p>

        <div className="mt-4 flex flex-col gap-4 pb-6">
          <Field label="이름 · Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="이름"
              className="h-[52px] rounded-[14px] border border-[rgb(30_25_15/0.14)] bg-surface px-4 text-md font-medium text-[#2B2924] outline-none focus-visible:border-primary"
            />
          </Field>

          <Field label="성별 · Gender">
            <div className="flex gap-2">
              {GENDERS.map((option) => {
                const selected = gender === option.id
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => setGender(option.id)}
                    aria-pressed={selected}
                    whileTap={{ scale: PRESS.button }}
                    transition={T.dissolve}
                    className={cn(
                      'h-12 flex-1 rounded-xl border text-center transition-[background-color,border-color] duration-200 ease-figma',
                      selected
                        ? 'border-primary bg-primary/9 text-md font-semibold text-primary-deep'
                        : 'border-[rgb(30_25_15/0.14)] bg-surface text-sm font-medium text-ink-4',
                    )}
                  >
                    {option.label}
                  </motion.button>
                )
              })}
            </div>
          </Field>

          <Field label="나이 · Age">
            <div className="flex h-[52px] items-center justify-between rounded-[14px] border border-[rgb(30_25_15/0.14)] bg-surface px-4 focus-within:border-primary">
              <input
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
                inputMode="numeric"
                aria-label="나이"
                className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-[#2B2924] outline-none"
              />
              <span className="text-base text-muted">세</span>
            </div>
          </Field>
        </div>
      </ScreenBody>

      <footer className="shrink-0 px-6 pt-4 pb-[30px]">
        <Button onClick={save}>저장 · Save</Button>
      </footer>
    </div>
  )
}
