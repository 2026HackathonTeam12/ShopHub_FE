import { createMutationHook } from "./createMutationHook"
import { fetchOAuthStatus, type OAuthConnectionStatus } from "../api"
import { useSetIntegrations } from "../store"
import type { PlatformId } from "../data/platforms"

export const useFetchIntegrationsMutation = createMutationHook<string, OAuthConnectionStatus[]>()
    .state(() => {
        const setIntegrations = useSetIntegrations()
        return { setIntegrations }
    })
    .request((storeId) => storeId)
    .api(fetchOAuthStatus)
    .update((statuses, { setIntegrations }) => {
        const connected = statuses
            .filter((s) => s.connected)
            .map((s) => s.type as PlatformId)
        setIntegrations(connected)
    })
    .build()
