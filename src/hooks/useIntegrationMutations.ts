import { createMutationHook } from "./createMutationHook"
import { disconnectOAuth, fetchOAuthStatus, type OAuthConnectionStatus } from "../api"
import type { PlatformId } from "../data/platforms"
import { useSetIntegrations } from "../store"

export const useDisconnectOAuthMutation = createMutationHook<{ platformId: PlatformId; storeId: string }, OAuthConnectionStatus>()
    .state(() => {
        const setIntegrations = useSetIntegrations()
        return { setIntegrations }
    })
    .request(({ platformId, storeId }) => ({ platformId, storeId }))
    .api(({ platformId, storeId }) => disconnectOAuth(platformId, storeId))
    .update((status, { setIntegrations }) => {
        setIntegrations((current) => ({
            ...current,
            connected: current.connected.filter((id) => id !== (status.type as PlatformId)),
        }))
    })
    .build()

export const useFetchIntegrationsMutation = createMutationHook<string, OAuthConnectionStatus[]>()
    .state(() => {
        const setIntegrations = useSetIntegrations()
        return { setIntegrations }
    })
    .request((storeId) => storeId)
    .api(fetchOAuthStatus)
    .update((statuses, { setIntegrations }) => {
        setIntegrations({
            connected: statuses
                .filter((s) => s.connected)
                .map((s) => s.type as PlatformId),
            connectable: statuses
                .filter((s) => s.credentialsConfigured)
                .map((s) => s.type as PlatformId),
        })
    })
    .build()
