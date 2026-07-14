export type PlatformId =
    | "INSTAGRAM"
    | "X"
    | "FACEBOOK"
    | "MOCK_MAP"
    | "KAKAO_MAP"
    | "GOOGLE_MAP"
    | "NAVER_MAP"

export interface PlatformMeta {
    name: string
    /** 연동 버튼 노출 여부 */
    available: boolean
}

/** 매장별 연동(OAuth 또는 pseudo-OAuth) 대상 */
export const OAUTH_PLATFORM_IDS = new Set<PlatformId>(["MOCK_MAP", "X", "INSTAGRAM", "FACEBOOK"])

/** 서버 .env 고정 Graph 계정 — 연동 시 공용 계정에 매장을 연결 */
export const FIXED_ACCOUNT_PLATFORM_IDS = new Set<PlatformId>(["INSTAGRAM", "FACEBOOK"])

export const PLATFORM_META: Record<PlatformId, PlatformMeta> = {
    INSTAGRAM: { name: "Instagram", available: true },
    X: { name: "X", available: true },
    FACEBOOK: { name: "Facebook", available: true },
    MOCK_MAP: { name: "MAP", available: true },
    KAKAO_MAP: { name: "카카오맵", available: false },
    GOOGLE_MAP: { name: "Google Business", available: false },
    NAVER_MAP: { name: "네이버 플레이스", available: false },
}

/** BE ContentChannel과 일치 — publish 가능한 채널만 */
export const CONTENT_CHANNEL_IDS = new Set<PlatformId>(["INSTAGRAM", "X", "FACEBOOK"])

export function isContentChannel(id: PlatformId): boolean {
    return CONTENT_CHANNEL_IDS.has(id)
}

export function isOAuthPlatform(id: PlatformId): boolean {
    return OAUTH_PLATFORM_IDS.has(id)
}

export function isFixedAccountPlatform(id: PlatformId): boolean {
    return FIXED_ACCOUNT_PLATFORM_IDS.has(id)
}
