import type { StoreProfile, BusinessHour } from "./data/store"
import type { Review } from "./store/ReviewContext"
import type { PlatformId } from "./data/platforms"

const BASE_URL = "http://localhost:8080"

const TOKEN_KEY = "shophub_access_token"

let accessToken: string | null = localStorage.getItem(TOKEN_KEY)

export function setAccessToken(token: string) {
    accessToken = token
    localStorage.setItem(TOKEN_KEY, token)
}

export function clearAccessToken() {
    accessToken = null
    localStorage.removeItem(TOKEN_KEY)
}

export class UnauthorizedError extends Error {
    constructor() {
        super("인증이 필요합니다.")
    }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(init.headers as Record<string, string>),
    }
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`
    }
    const response = await fetch(`${BASE_URL}${path}`, { ...init, headers })
    if (!response.ok) {
        if (response.status === 401) throw new UnauthorizedError()
        const body = await response.json().catch(() => ({}))
        throw new Error(body.message ?? `${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<T>
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
    email: string
    password: string
}

export interface SignUpRequest {
    email: string
    password: string
    name: string
}

export interface UserProfile {
    id: string
    email: string
    name: string
}

export interface AuthResponse {
    accessToken: string
    expiresAt: string
    user: UserProfile
}

export async function loginAndFetchStores(
    req: LoginRequest,
): Promise<{ user: UserProfile; stores: StoreProfile[] }> {
    const auth = await request<AuthResponse>("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(req),
    })
    setAccessToken(auth.accessToken)
    const stores = await request<StoreProfile[]>("/v1/stores")
    return { user: auth.user, stores }
}

export async function signUp(req: SignUpRequest): Promise<AuthResponse> {
    const auth = await request<AuthResponse>("/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(req),
    })
    setAccessToken(auth.accessToken)
    return auth
}

export async function fetchCurrentUser(): Promise<UserProfile> {
    return request<UserProfile>("/v1/auth/me")
}

// ── Stores ────────────────────────────────────────────────────────────────────

export interface CreateStoreRequest {
    name: string
    category: string
    address: string
    phone: string
    tone: string
    hours: string
    menu: string[]
}

export async function fetchStores(): Promise<StoreProfile[]> {
    return request<StoreProfile[]>("/v1/stores")
}

export async function createStore(req: CreateStoreRequest): Promise<StoreProfile> {
    return request<StoreProfile>("/v1/stores", {
        method: "POST",
        body: JSON.stringify(req),
    })
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export async function fetchReviews(storeId: string): Promise<Review[]> {
    return request<Review[]>(`/v1/stores/${storeId}/reviews`)
}

export interface AiDraftRequest {
    reviewId: string
}

export interface AiDraftResponse {
    content: string
}

export async function generateReviewDraft(req: AiDraftRequest): Promise<AiDraftResponse> {
    return request<AiDraftResponse>(`/v1/reviews/${req.reviewId}/ai-draft`, { method: "POST" })
}

export interface ReplyRequest {
    reviewId: string
    content: string
}

export async function replyToReview(req: ReplyRequest): Promise<Review> {
    return request<Review>(`/v1/reviews/${req.reviewId}/reply`, {
        method: "POST",
        body: JSON.stringify({ content: req.content }),
    })
}

// ── Store Profile ─────────────────────────────────────────────────────────────

export interface UpdateBasicRequest {
    storeId: string
    name: string
    phone: string
    introduction: string
    address: string
    category: string
    toneOfVoice: string
}

export async function updateStoreBasic(req: UpdateBasicRequest): Promise<StoreProfile> {
    const { storeId, ...body } = req
    return request<StoreProfile>(`/v1/stores/${storeId}/profile/basic`, {
        method: "PUT",
        body: JSON.stringify(body),
    })
}

export interface UpdateHoursRequest {
    storeId: string
    businessHours: BusinessHour[]
}

export async function updateStoreHours(req: UpdateHoursRequest): Promise<StoreProfile> {
    const { storeId, ...body } = req
    return request<StoreProfile>(`/v1/stores/${storeId}/profile/hours`, {
        method: "PUT",
        body: JSON.stringify(body),
    })
}

export interface AddMenuRequest {
    storeId: string
    name: string
    description: string
}

export async function addStoreMenu(req: AddMenuRequest): Promise<StoreProfile> {
    const { storeId, ...body } = req
    return request<StoreProfile>(`/v1/stores/${storeId}/profile/menus`, {
        method: "POST",
        body: JSON.stringify(body),
    })
}

export interface DeleteMenuRequest {
    storeId: string
    menuId: string
}

export async function deleteStoreMenu(req: DeleteMenuRequest): Promise<StoreProfile> {
    return request<StoreProfile>(`/v1/stores/${req.storeId}/profile/menus/${req.menuId}`, {
        method: "DELETE",
    })
}

// ── Content ───────────────────────────────────────────────────────────────────

export interface GenerateContentRequest {
    storeId: string
    eventText: string
}

export interface ContentSuggestion {
    title: string
    body: string
    source: string
}

export async function generateContentDraft(req: GenerateContentRequest): Promise<ContentSuggestion> {
    const { storeId, ...body } = req
    return request<ContentSuggestion>(`/v1/stores/${storeId}/contents/suggest`, {
        method: "POST",
        body: JSON.stringify(body),
    })
}

export interface PublishContentRequest {
    storeId: string
    title: string
    body: string
    channels: string[]
}

export interface ContentItem {
    id: string
    storeId: string
    title: string
    body: string
    channels: string[]
    status: string
    updatedAt: string
}

export async function publishContent(req: PublishContentRequest): Promise<ContentItem> {
    const { storeId, ...body } = req
    return request<ContentItem>(`/v1/stores/${storeId}/contents`, {
        method: "POST",
        body: JSON.stringify(body),
    })
}

export async function fetchContents(storeId: string): Promise<ContentItem[]> {
    return request<ContentItem[]>(`/v1/stores/${storeId}/contents`)
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardSuggestionCard {
    title: string
    message: string
    actionLabel: string
}

export async function fetchDashboard(storeId: string): Promise<{ suggestionCard: DashboardSuggestionCard }> {
    return request(`/v1/stores/${storeId}/dashboard`)
}

// ── Integrations ───────────────────────────────────────────────────────────────

export interface OAuthConnectionStatus {
    type: string
    credentialsConfigured: boolean
    connected: boolean
    clientId: string | null
    placeId: string | null
    placeName: string | null
    updatedAt: string | null
}

export async function fetchOAuthStatus(storeId: string): Promise<OAuthConnectionStatus[]> {
    return request(`/api/integrations/oauth/status?storeId=${storeId}`)
}

export async function startOAuth(platformId: PlatformId, storeId: string): Promise<string> {
    const headers: Record<string, string> = {}
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`
    const response = await fetch(`${BASE_URL}/api/integrations/${platformId}/oauth/start?storeId=${storeId}`, {
        headers,
        redirect: "manual",
    })
    const location = response.headers.get("Location")
    if (!location) throw new Error("OAuth 시작 URL을 받지 못했습니다.")
    return location
}
