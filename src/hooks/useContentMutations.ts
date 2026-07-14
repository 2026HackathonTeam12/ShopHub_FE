import { useState, useCallback } from "react"
import {
    generateContentDraft,
    publishContent,
    fetchContents,
    type GenerateContentRequest,
    type ContentSuggestion,
    type PublishContentRequest,
    type ContentItem,
} from "../api"
import { createMutationHook } from "./createMutationHook"
import { useSetPosts, type Post } from "../store"
import { getRelativeTime } from "../utils/timeUtils"

const statusMap: Record<string, string> = {
    DRAFT: "초안",
    SCHEDULED: "예약됨",
    PUBLISHED: "게시됨",
    FAILED: "실패",
}

function toPost(item: ContentItem): Post {
    return {
        id: item.id,
        title: item.title,
        channels: item.channels.join(" · "),
        date: getRelativeTime(item.updatedAt),
        status: statusMap[item.status] ?? item.status,
    }
}

export const useFetchContentsMutation = createMutationHook<
    string,
    ContentItem[]
>()
    .state(() => {
        const setPosts = useSetPosts()
        return { setPosts }
    })
    .request((storeId) => storeId)
    .api(fetchContents)
    .update((items, { setPosts }) => {
        setPosts(items.map(toPost))
    })
    .build()

export function useGenerateContentDraftMutation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const run = useCallback(
        async (
            req: GenerateContentRequest,
        ): Promise<ContentSuggestion | null> => {
            setLoading(true)
            setError(null)
            try {
                const response = await generateContentDraft(req)
                setLoading(false)
                return response
            } catch (err) {
                setLoading(false)
                setError(
                    err instanceof Error
                        ? err.message
                        : "알 수 없는 오류가 발생했습니다.",
                )
                return null
            }
        },
        [],
    )

    return { loading, error, run }
}

export const usePublishContentMutation = createMutationHook<
    PublishContentRequest,
    ContentItem
>()
    .state(() => {
        const setPosts = useSetPosts()
        return { setPosts }
    })
    .request((req) => req)
    .api(publishContent)
    .update((item, { setPosts }) => {
        setPosts((current) => [toPost(item), ...current])
    })
    .build()
