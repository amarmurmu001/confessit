'use client'

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/app/providers'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 rounded-full bg-base-200 hover:bg-base-300 transition-colors shadow-lg"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-6 h-6 text-base-content" />
      ) : (
        <SunIcon className="w-6 h-6 text-base-content" />
      )}
    </button>
  )
}