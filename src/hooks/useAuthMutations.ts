import { createMutationHook } from "./createMutationHook"
import {
    fetchCurrentUser,
    loginAndFetchStores,
    signUp,
    type AuthResponse,
    type LoginRequest,
    type SignUpRequest,
} from "../api"
import { useSetStores, useSetSelectedStoreId, useSetUser } from "../store"
import type { StoreProfile } from "../data/store"
import type { UserProfile } from "../store"

export const useLoginMutation = createMutationHook<
    LoginRequest,
    { user: UserProfile; stores: StoreProfile[] }
>()
    .state(() => {
        const setStores = useSetStores()
        const setSelectedStoreId = useSetSelectedStoreId()
        const setUser = useSetUser()
        return { setStores, setSelectedStoreId, setUser }
    })
    .request((i) => i)
    .api(loginAndFetchStores)
    .update(({ user, stores }, { setStores, setSelectedStoreId, setUser }) => {
        setUser(user)
        setStores(stores)
        setSelectedStoreId(stores[0]?.id ?? "")
    })
    .build()

export const useSignupMutation = createMutationHook<SignUpRequest, AuthResponse>()
    .state(() => {
        const setUser = useSetUser()
        return { setUser }
    })
    .request((i) => i)
    .api(signUp)
    .update((auth, { setUser }) => {
        setUser(auth.user)
        // stores remain empty after signup — user proceeds to onboarding
    })
    .build()

export const useFetchUserMutation = createMutationHook<void, UserProfile>()
    .state(() => {
        const setUser = useSetUser()
        return { setUser }
    })
    .request(() => undefined)
    .api(() => fetchCurrentUser())
    .update((user, { setUser }) => {
        setUser(user)
    })
    .build()
