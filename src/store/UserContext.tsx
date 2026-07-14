import { createStateContext } from "./createStateContext"
import type { UserProfile } from "../api"

export type { UserProfile }

export const {
    Provider: UserProvider,
    useValue: useUser,
    useSetValue: useSetUser,
} = createStateContext<UserProfile | null>(null)
