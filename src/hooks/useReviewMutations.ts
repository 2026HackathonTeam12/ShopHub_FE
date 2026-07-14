import { useState, useCallback } from "react"
import { createMutationHook } from "./createMutationHook"
import { fetchReviews, generateReviewDraft, replyToReview, type ReplyRequest } from "../api"
import { useSetReviews } from "../store"
import type { Review } from "../store/ReviewContext"

export const useFetchReviewsMutation = createMutationHook<string, Review[]>()
    .state(() => {
        const setReviews = useSetReviews()
        return { setReviews }
    })
    .request((storeId) => storeId)
    .api(fetchReviews)
    .update((reviews, { setReviews }) => {
        setReviews(reviews)
    })
    .build()

export function useGenerateDraftMutation() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const run = useCallback(async (reviewId: string): Promise<string | null> => {
        setLoading(true)
        setError(null)
        try {
            const response = await generateReviewDraft({ reviewId })
            setLoading(false)
            return response.content
        } catch (err) {
            setLoading(false)
            setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
            return null
        }
    }, [])

    return { loading, error, run }
}

export const useSendReplyMutation = createMutationHook<ReplyRequest, Review>()
    .state(() => {
        const setReviews = useSetReviews()
        return { setReviews }
    })
    .request((req) => req)
    .api(replyToReview)
    .update((updatedReview, { setReviews }) => {
        setReviews((current) => current.map((r) => (r.id === updatedReview.id ? updatedReview : r)))
    })
    .build()
