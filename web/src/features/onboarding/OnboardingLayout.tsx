import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScreenBody } from '@/components/shell/Screen'
import { Stepper } from '@/components/shell/TopBar'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/**
 * The frame shared by P03 / P04 / P05: stepper, heading pair, scrollable body
 * and a 100px footer holding the primary CTA.
 */
export function OnboardingLayout({
  step,
  heading,
  subheading,
  children,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondary,
  headingClassName,
}: {
  step: number
  heading: string
  subheading?: string
  children: ReactNode
  primaryLabel: string
  onPrimary: () => void
  primaryDisabled?: boolean
  secondary?: ReactNode
  headingClassName?: string
}) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col bg-bg">
      <Stepper step={step} onBack={() => navigate(-1)} />

      <ScreenBody className="px-6 pt-[21px]">
        <h1
          className={cn(
            'text-2xl leading-heading font-bold tracking-title whitespace-pre-line text-ink',
            headingClassName,
          )}
        >
          {heading}
        </h1>
        {subheading && (
          <p className="mt-[7px] text-base leading-[20px] text-muted-2">{subheading}</p>
        )}

        <div className="mt-4 pb-6">{children}</div>
      </ScreenBody>

      <footer className="shrink-0 px-6 pt-4 pb-[30px]">
        {secondary}
        <Button onClick={onPrimary} disabled={primaryDisabled}>
          {primaryLabel}
        </Button>
      </footer>
    </div>
  )
}
