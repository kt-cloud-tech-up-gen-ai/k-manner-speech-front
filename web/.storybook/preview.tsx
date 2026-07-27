import type { Preview } from '@storybook/react-vite'
import { MotionConfig } from 'motion/react'
import { MemoryRouter } from 'react-router-dom'
import '../src/index.css'

/**
 * Components are designed against a 360x768 canvas on a #F3F4F6 page, so the
 * default background matches the Figma page rather than white. Stories that
 * need the device chrome opt into the `phone` decorator in DeviceFrame.tsx.
 *
 * MemoryRouter is global because TabBar, cards and rows use <Link>/useNavigate;
 * without it every navigational component throws in isolation.
 */
const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i } },
    a11y: { test: 'todo' },
    backgrounds: {
      options: {
        page: { name: 'Page (#F3F4F6)', value: '#F3F4F6' },
        app: { name: 'App (#FDFBF7)', value: '#FDFBF7' },
        surface: { name: 'Surface (#FFFFFF)', value: '#FFFFFF' },
        dark: { name: 'Dark (#26241F)', value: '#26241F' },
      },
    },
  },
  initialGlobals: { backgrounds: { value: 'page' } },
  decorators: [
    (Story) => (
      <MotionConfig reducedMotion="user">
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </MotionConfig>
    ),
  ],
}

export default preview
