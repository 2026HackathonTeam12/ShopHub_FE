const trimTrailingSlash = (value: string) => (value.endsWith("/") ? value.slice(0, -1) : value)

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080")

export const MOCKMAP_BASE_URL = trimTrailingSlash(import.meta.env.VITE_MOCKMAP_BASE_URL ?? "http://localhost:8000")

export const MOCKMAP_OWNER_ACCOUNT_URL = `${MOCKMAP_BASE_URL}/owner/account/`

export function buildMockMapReviewReplyUrl(placeId: string, sourceReviewId: string) {
    const params = new URLSearchParams({ place_id: placeId })
    return `${MOCKMAP_BASE_URL}/?${params.toString()}#review-${sourceReviewId}`
}
