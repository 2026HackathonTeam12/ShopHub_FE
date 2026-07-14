export type PlatformId =
    | "INSTAGRAM"
    | "NAVER_BLOG"
    | "FACEBOOK"
    | "MOCK_MAP"
    | "KAKAO_MAP"
    | "GOOGLE_MAP"
    | "NAVER_MAP"

export interface PlatformMeta {
    name: string
    available: boolean
}

export const PLATFORM_META: Record<PlatformId, PlatformMeta> = {
    INSTAGRAM: { name: "Instagram", available: false },
    NAVER_BLOG: { name: "네이버 블로그", available: false },
    FACEBOOK: { name: "Facebook", available: false },
    MOCK_MAP: { name: "MAP", available: true },
    KAKAO_MAP: { name: "카카오맵", available: false },
    GOOGLE_MAP: { name: "Google Business", available: false },
    NAVER_MAP: { name: "네이버 플레이스", available: false },
}
