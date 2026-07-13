import type { ReactNode } from "react"
import { StoreProvider } from "./StoreContext"
import { ReviewProvider } from "./ReviewContext"
import { StoreSettingsProvider } from "./StoreSettingsContext"

export { useStores } from "./StoreContext"
export { useReviews, type Review } from "./ReviewContext"
export { useStoreSettings } from "./StoreSettingsContext"

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <StoreProvider>
            <ReviewProvider>
                <StoreSettingsProvider>{children}</StoreSettingsProvider>
            </ReviewProvider>
        </StoreProvider>
    )
}
