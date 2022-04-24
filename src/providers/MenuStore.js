import { createContext, useState } from 'react'

export const MenuStore = createContext()
export default function MenuProvider({ children }) {
    const [menuOpen, setMenuOpen] = useState(false)
    return <MenuStore.Provider value={{ menuOpen, setMenuOpen }}>{children}</MenuStore.Provider>
}
