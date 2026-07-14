# Dangling State

Remaining application state not yet migrated to the backend-backed model.

---

## DS-1: Dashboard Suggestion Card

**Name:** Dashboard Suggestion Card

**Files involved:**
- `src/features/dashboard/components/AIRecommendation.tsx`

**Current state update path:**
All three display values are hardcoded inline — no state, no fetch:
```tsx
// AIRecommendation.tsx ~line 30-36
"연남동 · 비 · 18°C"
"'비 오는 오후, 따뜻한 한 잔'을 지금 올려보세요."
"따뜻한 음료 게시물은 이 날씨에 저장률이 더 높았어요."
```

**Corresponding backend API:**
`GET /v1/stores/{storeId}/dashboard` → `DashboardOverview.suggestionCard`

```ts
DashboardSuggestionCard {
  title: string      // maps to subtitle line (e.g. "연남동 · 비 · 18°C")
  message: string    // maps to main recommendation text
  actionLabel: string
}
```

**Dependency on other migration units:** None. Requires `selectedStoreId` to be set (already available via `useSelectedStoreId`).

**Notes / edge cases:**
- The dashboard endpoint returns a large `DashboardOverview` object. Consider whether to store the full overview in a new `DashboardContext` or fetch and keep it component-local.
- `actionLabel` from the API has no current UI target — skip or wire to the existing "지금 올리기" button.
- `DashboardOverview` also contains `draftContent`, `reviewWidget`, `checklistItems`, and `recentReviews`. These are not currently rendered in the frontend, so the fetch can be scoped to `suggestionCard` only at the component level, or the full response can be stored for future use.

---

## DS-2: User Profile

**Name:** User Profile (Mypage)

**Files involved:**
- `src/features/account/pages/Mypage.tsx`

**Current state update path:**
All user identity fields are hardcoded. The `save()` handler only sets local UI state (`setSaved(true)`) with no API call:
```tsx
// Mypage.tsx
avatar initials: "JI"
name field defaultValue: "김지인"
phone field defaultValue: "010-3492-0426"
email field defaultValue: "jiin@momo-coffee.kr"  // appears twice
save(): setSaved(true)  // no API call
```

**Corresponding backend API:**
`POST /v1/auth/login` and `POST /v1/auth/signup` both return `AuthResponse.user: UserProfile { id, email, name }`.

There is **no user profile update endpoint** defined in openapi.yaml. The `save()` action on Mypage cannot be wired to a backend until one is added.

**Dependency on other migration units:** None. Requires a `UserContext` (or similar) to store `UserProfile` received at login/signup.

**Notes / edge cases:**
- `UserProfile` has `id`, `email`, `name` — no `phone` field. The phone input on Mypage has no backend counterpart in the current spec.
- Avatar initials ("JI") should be derived from `UserProfile.name` using `getInitials()`.
- `AuthPage` currently calls `setStores` and `navigate` on success but discards the `user` field from `AuthResponse`. A `UserContext` must be introduced and populated at login/signup time.
- The password change section ("마지막 변경 2026. 05. 12") also has no API backing — out of scope until an endpoint is defined.
