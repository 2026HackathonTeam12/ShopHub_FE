import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useStores } from "./StoreContext"

const defaultHours = [
    ["월요일", "10:00", "21:00"],
    ["화요일", "10:00", "21:00"],
    ["수요일", "10:00", "21:00"],
    ["목요일", "10:00", "21:00"],
    ["금요일", "10:00", "22:00"],
    ["토요일", "11:00", "22:00"],
    ["일요일", "11:00", "20:00"],
]

interface StoreSettingsContextValue {
    hours: string[][]
    menus: string[]
    updateHours: (index: number, position: number, value: string) => void
    addMenu: (item: string) => void
    resetToStoreDefaults: () => void
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | null>(null)

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
    const { selectedStore } = useStores()

    const [hours, setHours] = useState<string[][]>(defaultHours)
    const [menus, setMenus] = useState<string[]>(selectedStore?.menu || [])

    const updateHours = useCallback((index: number, position: number, value: string) => {
        setHours((current) =>
            current.map((row, rowIndex) =>
                rowIndex === index ? row.map((cell, cellIndex) => (cellIndex === position ? value : cell)) : row
            )
        )
    }, [])

    const addMenu = useCallback((item: string) => {
        const trimmed = item.trim()
        if (!trimmed) return
        setMenus((current) => {
            if (current.includes(trimmed)) return current
            return [...current, trimmed]
        })
    }, [])

    const resetToStoreDefaults = useCallback(() => {
        setHours(defaultHours)
        setMenus(selectedStore?.menu || [])
    }, [selectedStore?.menu])

    return (
        <StoreSettingsContext.Provider
            value={{
                hours,
                menus,
                updateHours,
                addMenu,
                resetToStoreDefaults,
            }}
        >
            {children}
        </StoreSettingsContext.Provider>
    )
}

export function useStoreSettings() {
    const context = useContext(StoreSettingsContext)
    if (!context) {
        throw new Error("useStoreSettings must be used within a StoreSettingsProvider")
    }
    return context
}
