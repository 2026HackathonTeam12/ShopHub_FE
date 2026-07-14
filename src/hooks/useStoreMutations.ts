import { useState, useCallback } from "react"
import { createMutationHook } from "./createMutationHook"
import {
    fetchStores,
    createStore,
    updateStoreBasic,
    updateStoreHours,
    addStoreMenu,
    type CreateStoreRequest,
    type UpdateBasicRequest,
    type UpdateHoursRequest,
    type AddMenuRequest,
} from "../api"
import { useSetStores, useSetSelectedStoreId } from "../store"
import type { StoreProfile } from "../data/store"

type CreateStoreForm = {
    name: string
    category: string
    address: string
    phone: string
    hours: string
    menu: string
    tone: string
}

export const useFetchStoresMutation = createMutationHook<void, StoreProfile[]>()
    .state(() => {
        const setStores = useSetStores()
        return { setStores }
    })
    .request(() => undefined)
    .api(() => fetchStores())
    .update((stores, { setStores }) => {
        setStores(stores)
    })
    .build()

export const useUpdateBasicMutation = createMutationHook<UpdateBasicRequest, StoreProfile>()
    .state(() => {
        const setStores = useSetStores()
        return { setStores }
    })
    .request((req) => req)
    .api(updateStoreBasic)
    .update((store, { setStores }) => {
        setStores((current) => current.map((s) => (s.id === store.id ? store : s)))
    })
    .build()

export const useUpdateHoursMutation = createMutationHook<UpdateHoursRequest, StoreProfile>()
    .state(() => {
        const setStores = useSetStores()
        return { setStores }
    })
    .request((req) => req)
    .api(updateStoreHours)
    .update((store, { setStores }) => {
        setStores((current) => current.map((s) => (s.id === store.id ? store : s)))
    })
    .build()

export const useAddMenuMutation = createMutationHook<AddMenuRequest, StoreProfile>()
    .state(() => {
        const setStores = useSetStores()
        return { setStores }
    })
    .request((req) => req)
    .api(addStoreMenu)
    .update((store, { setStores }) => {
        setStores((current) => current.map((s) => (s.id === store.id ? store : s)))
    })
    .build()

export const useCreateStoreMutation = createMutationHook<CreateStoreForm, StoreProfile>()
    .state(() => {
        const setStores = useSetStores()
        const setSelectedStoreId = useSetSelectedStoreId()
        return { setStores, setSelectedStoreId }
    })
    .request((form): CreateStoreRequest => ({
        name: form.name.trim(),
        category: form.category,
        address: form.address.trim(),
        phone: form.phone.trim(),
        tone: form.tone,
        hours: form.hours,
        menu: form.menu.split(",").map((m) => m.trim()).filter(Boolean),
    }))
    .api(createStore)
    .update((store, { setStores, setSelectedStoreId }) => {
        setStores((current) => [...current, store])
        setSelectedStoreId(store.id)
    })
    .build()
