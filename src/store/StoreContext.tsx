import type { ReactNode } from "react"
import { type StoreProfile } from "../data/store"
import { createStateContext } from "./createStateContext"

export const {
    Provider: StoresProvider,
    useValue: useStores,
    useSetValue: useSetStores,
    useValueState: useStoresState,
} = createStateContext<StoreProfile[]>([])

export const {
    Provider: SelectedStoreIdProvider,
    useValue: useSelectedStoreId,
    useSetValue: useSetSelectedStoreId,
    useValueState: useSelectedStoreIdState,
} = createStateContext<string>("")

export function StoreProvider({ children }: { children: ReactNode }) {
    return (
        <StoresProvider>
            <SelectedStoreIdProvider>{children}</SelectedStoreIdProvider>
        </StoresProvider>
    )
}
