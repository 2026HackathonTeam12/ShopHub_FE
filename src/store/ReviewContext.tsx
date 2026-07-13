import { createContext, useContext, type ReactNode } from "react"

export interface Review {
    id: number
    name: string
    rating: number
    time: string
    text: string
}

const mockReviews: Review[] = [
    {
        id: 1,
        name: "하은 서",
        rating: 5,
        time: "32분 전",
        text: "커피도 정말 맛있고, 직원분이 메뉴를 친절하게 설명해주셨어요. 비 오는 날 창가 자리가 특히 좋네요.",
    },
    {
        id: 2,
        name: "민준 김",
        rating: 4,
        time: "2시간 전",
        text: "조용히 일하기 좋아요. 디카페인 옵션이 더 많아지면 좋겠습니다.",
    },
    {
        id: 3,
        name: "예린 박",
        rating: 5,
        time: "어제",
        text: "휘낭시에 선물 포장도 너무 예뻐요. 다음에 또 올게요!",
    },
    {
        id: 4,
        name: "도현 이",
        rating: 5,
        time: "어제",
        text: "연남동에서 가장 편안한 커피 공간이에요. 라떼가 특히 좋았습니다.",
    },
    {
        id: 5,
        name: "서진 윤",
        rating: 4,
        time: "7월 11일",
        text: "친절하고 분위기가 좋아요. 주말에는 조금 붐비네요.",
    },
]

interface ReviewContextValue {
    reviews: Review[]
}

const ReviewContext = createContext<ReviewContextValue | null>(null)

export function ReviewProvider({ children }: { children: ReactNode }) {
    // TODO: Replace with API fetch
    const reviews = mockReviews

    return <ReviewContext.Provider value={{ reviews }}>{children}</ReviewContext.Provider>
}

export function useReviews() {
    const context = useContext(ReviewContext)
    if (!context) {
        throw new Error("useReviews must be used within a ReviewProvider")
    }
    return context
}
