import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { getPaceOptions, logout, withdraw } from '@/api/client'
import type { PaceOption } from '@/api/types'
import { ScreenBody } from '@/components/shell/Screen'
import { TitlePair } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Toggle } from '@/components/ui/Toggle'
import { EASE_OUT } from '@/lib/motion'
import { useAppStore } from '@/store/useAppStore'
import { LanguagePickerSheet } from './LanguagePickerSheet'
import { SettingsGroup, SettingsRow } from './SettingsRow'

const AVATAR_GRADIENT = 'linear-gradient(135deg, #E7E1D4 0%, #DED7C8 100%)'

/**
 * P13 · Account settings, covering the signed-in and P13A guest variants, the
 * P13B notifications-off state, the language picker overlay and the P13C
 * delete-confirmation dialog.
 */
export function SettingsScreen() {
  const navigate = useNavigate()

  const signedIn = useAppStore((s) => s.signedIn)
  const signOut = useAppStore((s) => s.signOut)
  const reset = useAppStore((s) => s.reset)
  const profile = useAppStore((s) => s.profile)
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const pace = useAppStore((s) => s.pace)
  const notificationsAllowed = useAppStore((s) => s.notificationsAllowed)
  const setNotifications = useAppStore((s) => s.setNotifications)

  const [paceOptions, setPaceOptions] = useState<PaceOption[]>([])
  const [languageOpen, setLanguageOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [accountError, setAccountError] = useState('')

  useEffect(() => {
    getPaceOptions().then(setPaceOptions)
  }, [])

  const paceOption = paceOptions.find((p) => p.id === pace)
  const paceLabel = paceOption ? `주 ${paceOption.times}회` : '미설정'
  const localeLabel = locale === 'ko' ? '한국어 · KO' : 'English · EN'

  const handleLogout = async () => {
    setAccountError('')
    try {
      await logout()
      signOut()
      navigate('/login', { replace: true })
    } catch {
      setAccountError('로그아웃하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  const handleDelete = async () => {
    setAccountError('')
    try {
      if (signedIn) await withdraw()
      setDeleteOpen(false)
      reset()
      navigate('/splash', { replace: true })
    } catch {
      setAccountError('회원탈퇴를 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    <div className="flex h-full flex-col bg-bg">
      <header className="flex h-10 shrink-0 items-center px-[22px] pt-2.5">
        <TitlePair ko="내 정보" en="Account" />
      </header>

      <ScreenBody className="px-[22px] pt-3">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.05 }}
          className="flex flex-col gap-3.5 pb-6"
        >
          {/* Account card — P13A swaps the name/email for the guest prompt. */}
          <motion.button
            type="button"
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            onClick={() => navigate(signedIn ? '/profile' : '/login')}
            className="flex items-center gap-3.5 rounded-3xl border border-line bg-surface p-[15px] text-left transition-colors duration-200 ease-figma hover:bg-surface-sunken/30"
          >
            <span
              className="block h-[52px] w-[52px] shrink-0 rounded-full"
              style={{ background: AVATAR_GRADIENT }}
            />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-lg font-bold text-ink">
                {signedIn ? profile.name : '게스트'}
              </span>
              <span className="truncate text-xs text-muted">
                {signedIn ? 'emma.wilson@gmail.com' : '로그인하고 기록을 저장하세요'}
              </span>
            </span>
            <span aria-hidden="true" className="text-xl leading-none text-muted-4">
              ›
            </span>
          </motion.button>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <SettingsGroup label="학습 · LEARNING">
              <SettingsRow title="공부 목적" onClick={() => navigate('/settings/purpose')} />
              <SettingsRow
                title="주간 학습 횟수"
                value={paceLabel}
                onClick={() => navigate('/settings/pace')}
              />
            </SettingsGroup>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <SettingsGroup label="계정 · ACCOUNT">
              <SettingsRow
                title="개인정보 수정"
                onClick={() => navigate(signedIn ? '/profile' : '/login')}
              />
              <SettingsRow
                title="언어"
                value={localeLabel}
                onClick={() => setLanguageOpen(true)}
              />
              <SettingsRow
                title="알림"
                control={
                  <Toggle
                    checked={notificationsAllowed}
                    onChange={setNotifications}
                    label="알림 받기"
                  />
                }
              />
              <SettingsRow title="약관 · 정책" onClick={() => navigate('/legal')} />
            </SettingsGroup>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <SettingsGroup>
              <SettingsRow
                first
                chevron={false}
                title={signedIn ? '로그아웃' : '로그인'}
                tone="muted"
                onClick={() => void (signedIn ? handleLogout() : navigate('/login'))}
              />
              <SettingsRow
                title={signedIn ? '회원탈퇴' : '게스트 데이터 삭제'}
                value={signedIn ? '데이터 삭제' : '기기에서 삭제'}
                tone="danger"
                chevron={false}
                onClick={() => setDeleteOpen(true)}
              />
            </SettingsGroup>
            {accountError ? (
              <p className="px-4 pt-2 text-sm text-danger-ink" role="alert">
                {accountError}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      </ScreenBody>

      <LanguagePickerSheet
        open={languageOpen}
        locale={locale}
        onClose={() => setLanguageOpen(false)}
        onSave={(next) => {
          setLocale(next)
          setLanguageOpen(false)
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={signedIn ? '회원탈퇴' : '게스트 데이터 삭제'}
        description={
          signedIn
            ? '정말 탈퇴할까요? 모든 학습 기록과 데이터가 삭제되며 되돌릴 수 없습니다.'
            : '이 기기에 저장된 게스트 학습 기록이 삭제됩니다. 되돌릴 수 없습니다.'
        }
        cancelLabel="취소"
        confirmLabel={signedIn ? '탈퇴' : '삭제'}
        destructive
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}
