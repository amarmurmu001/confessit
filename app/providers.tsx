'use client'

import { createContext, useContext, useState } from 'react'
import { Toaster } from 'react-hot-toast'

type ThemeContextType = {
  theme: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
      <Toaster position="top-center" />
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
