import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { initialStores, type StoreProfile } from "../data/store"

interface StoreContextValue {
    stores: StoreProfile[]
    selectedStoreId: string
    selectedStore: StoreProfile | undefined
    setSelectedStoreId: (id: string) => void
    addStore: (store: StoreProfile) => void
    clearStores: () => void
    initializeStores: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
    const [stores, setStores] = useState<StoreProfile[]>(initialStores)
    const [selectedStoreId, setSelectedStoreId] = useState<string>(initialStores[0]?.id || "")

    const selectedStore = stores.find((s) => s.id === selectedStoreId)

    const addStore = useCallback((store: StoreProfile) => {
        setStores((current) => [...current, store])
        setSelectedStoreId(store.id)
    }, [])

    const clearStores = useCallback(() => {
        setStores([])
        setSelectedStoreId("")
    }, [])

    const initializeStores = useCallback(() => {
        setStores(initialStores)
        setSelectedStoreId(initialStores[0]?.id || "")
    }, [])

    return (
        <StoreContext.Provider
            value={{
                stores,
                selectedStoreId,
                selectedStore,
                setSelectedStoreId,
                addStore,
                clearStores,
                initializeStores,
            }}
        >
            {children}
        </StoreContext.Provider>
    )
}

export function useStores() {
    const context = useContext(StoreContext)
    if (!context) {
        throw new Error("useStores must be used within a StoreProvider")
    }
    return context
}
