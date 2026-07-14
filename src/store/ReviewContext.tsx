import { createStateContext } from "./createStateContext"

export interface Review {
    id: string
    storeId: string
    platform: string
    authorName: string
    rating: number
    content: string
    reviewedAt: string
    reply: string | null
    repliedAt: string | null
}

export const {
    Provider: ReviewProvider,
    useValue: useReviews,
    useSetValue: useSetReviews,
    useValueState: useReviewsState,
} = createStateContext<Review[]>([])
