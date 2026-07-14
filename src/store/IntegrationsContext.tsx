import { createStateContext } from "./createStateContext"
import type { PlatformId } from "../data/platforms"

export type IntegrationsSnapshot = {
    connected: PlatformId[]
    connectable: PlatformId[]
}

const EMPTY: IntegrationsSnapshot = { connected: [], connectable: [] }

const {
    Provider: IntegrationsProvider,
    useValue,
    useSetValue,
    useValueState,
} = createStateContext<IntegrationsSnapshot>(EMPTY)

export function useIntegrations(): PlatformId[] {
    return useValue().connected
}

export function useConnectablePlatforms(): PlatformId[] {
    return useValue().connectable
}

export { IntegrationsProvider, useSetValue as useSetIntegrations, useValueState as useIntegrationsState }
