import { createStateContext } from "./createStateContext"

export interface Post {
    title: string
    channels: string
    date: string
    status: string
}

export const {
    Provider: PostsProvider,
    useValue: usePosts,
    useSetValue: useSetPosts,
    useValueState: usePostsState,
} = createStateContext<Post[]>([])
