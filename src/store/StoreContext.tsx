import type { ReactNode } from "react"
import { useCallback, useContext, createContext, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { type StoreProfile } from "../data/store"
import { createStateContext } from "./createStateContext"

const SELECTED_STORE_KEY = "shophub_selected_store_id"

export const {
    Provider: StoresProvider,
    useValue: useStores,
    useSetValue: useSetStores,
    useValueState: useStoresState,
} = createStateContext<StoreProfile[]>([])

const SelectedStoreIdContext = createContext<string>("")
const SetSelectedStoreIdContext = createContext<Dispatch<SetStateAction<string>>>(() => {})

function readPersistedSelectedStoreId(): string {
    try {
        return localStorage.getItem(SELECTED_STORE_KEY) ?? ""
    } catch {
        return ""
    }
}

function writePersistedSelectedStoreId(storeId: string) {
    try {
        if (storeId) {
            localStorage.setItem(SELECTED_STORE_KEY, storeId)
        } else {
            localStorage.removeItem(SELECTED_STORE_KEY)
        }
    } catch {
        // ignore storage failures
    }
}

function SelectedStoreIdProvider({ children }: { children: ReactNode }) {
    const [selectedStoreId, setSelectedStoreIdState] = useState(readPersistedSelectedStoreId)

    const setSelectedStoreId = useCallback<Dispatch<SetStateAction<string>>>((value) => {
        setSelectedStoreIdState((current) => {
            const next = typeof value === "function" ? value(current) : value
            writePersistedSelectedStoreId(next)
            return next
        })
    }, [])

    return (
        <SelectedStoreIdContext.Provider value={selectedStoreId}>
            <SetSelectedStoreIdContext.Provider value={setSelectedStoreId}>
                {children}
            </SetSelectedStoreIdContext.Provider>
        </SelectedStoreIdContext.Provider>
    )
}

export function useSelectedStoreId(): string {
    return useContext(SelectedStoreIdContext)
}

export function useSetSelectedStoreId(): Dispatch<SetStateAction<string>> {
    return useContext(SetSelectedStoreIdContext)
}

export function useSelectedStoreIdState(): [string, Dispatch<SetStateAction<string>>] {
    return [useSelectedStoreId(), useSetSelectedStoreId()]
}

export function clearPersistedSelectedStoreId() {
    writePersistedSelectedStoreId("")
}

export function pickSelectedStoreId(
    stores: StoreProfile[],
    currentSelectedStoreId: string,
): string {
    if (currentSelectedStoreId && stores.some((store) => store.id === currentSelectedStoreId)) {
        return currentSelectedStoreId
    }
    const persisted = readPersistedSelectedStoreId()
    if (persisted && stores.some((store) => store.id === persisted)) {
        return persisted
    }
    return stores[0]?.id ?? ""
}

export function StoreProvider({ children }: { children: ReactNode }) {
    return (
        <StoresProvider>
            <SelectedStoreIdProvider>{children}</SelectedStoreIdProvider>
        </StoresProvider>
    )
}
