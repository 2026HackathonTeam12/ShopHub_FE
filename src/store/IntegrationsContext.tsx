import { createStateContext } from "./createStateContext"
import type { PlatformId } from "../data/platforms"

export const {
    Provider: IntegrationsProvider,
    useValue: useIntegrations,
    useSetValue: useSetIntegrations,
    useValueState: useIntegrationsState,
} = createStateContext<PlatformId[]>([])
