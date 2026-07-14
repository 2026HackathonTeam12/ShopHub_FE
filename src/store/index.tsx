import type { ReactNode } from "react"
import { StoreProvider } from "./StoreContext"
import { ReviewProvider } from "./ReviewContext"
import { PostsProvider } from "./ContentContext"
import { UserProvider } from "./UserContext"

export {
    useStores,
    useSetStores,
    useStoresState,
    useSelectedStoreId,
    useSetSelectedStoreId,
    useSelectedStoreIdState,
} from "./StoreContext"
export { useReviews, useSetReviews, useReviewsState, type Review } from "./ReviewContext"
export { usePosts, useSetPosts, usePostsState, type Post } from "./ContentContext"
export { useUser, useSetUser, type UserProfile } from "./UserContext"

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <StoreProvider>
                <ReviewProvider>
                    <PostsProvider>{children}</PostsProvider>
                </ReviewProvider>
            </StoreProvider>
        </UserProvider>
    )
}
