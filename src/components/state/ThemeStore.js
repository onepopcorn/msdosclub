import { useState, createContext } from 'react'

// Constants
const THEME_KEY = 'msdos-theme'
export const THEME_DARK = 'theme-dark'
export const THEME_LIGHT = 'theme-light'

// Store
export const ThemeStore = createContext()

// Provider
export default function ThemeProvider({ children }) {
    // Get stored state or default to THEME_LIGHT
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || THEME_LIGHT)

    // Persistence store of choosen value
    const changeTheme = (name) => {
        localStorage.setItem(THEME_KEY, name)
        setTheme(name)
    }

    return <ThemeStore.Provider value={{ theme, setTheme: changeTheme }}>{children}</ThemeStore.Provider>
}
