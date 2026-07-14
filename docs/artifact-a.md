# Artifact A — Migration Table

> Stage 1 output. No code is modified here.
> API endpoints are verified against `docs/openapi.yaml`.

---

## Excluded from migration

| State | Reason |
|-------|--------|
| `setSelectedStoreId` | Pure local UI preference — no corresponding write endpoint |
| `setInitialStoreStep` | Ephemeral wizard navigation, no backend relevance |
| `setStep`, `setIsPendingConfirm` | Wizard flow control, local only |
| `updateHours()` context fn | Intermediate edit buffer — persisted as part of **#8b Save Hours**, not independently |

---

## Mismatch resolution decisions

> Decided before Stage 2. Applied as pre-migration type alignment.

1. **`neighborhood`** — frontend error. Field removed. Only `address` exists (matches backend).
2. **Type/name mismatches** — align frontend types to backend. No adapter layer. Fields renamed in-place across all components.
   - `description` → `introduction`
   - `tone` → `toneOfVoice`
   - `hours: string` → `businessHours: BusinessHour[]`
   - `menu: string[]` → `menuItems: MenuItem[]`
   - `reviewCount` → `googleTotalReviews`
   - `Review.id: number` → `string`
   - `Review.name` → `authorName`
   - `Review.text` → `content`
   - `Review.time: string` → `reviewedAt: string` (ISO datetime)
3. **Derived / formatted values** — moved to utility functions, not stored in state:
   - `initials` — `getInitials(name: string): string` in `src/utils/storeUtils.ts`
   - `accent` — `getAccent(id: string): string` (deterministic from id) in `src/utils/storeUtils.ts`
   - relative time display — `getRelativeTime(isoDate: string): string` in `src/utils/timeUtils.ts`

---

## Migratable updates

---

### ✅ #1 — Login

| | |
|---|---|
| **State update** | `initializeStores()` → `setStores(...)`, `setSelectedStoreId(...)` |
| **Trigger** | Form submit (`AuthPage.tsx:44`) |
| **Mock** | `window.setTimeout` 700ms, then `onLogin()` |
| **API** | `POST /v1/auth/login` → `AuthResponse { accessToken, user }` then `GET /v1/stores` → `StoreProfile[]` |
| **Call sites** | `AuthPage.tsx:61–66`, `App.tsx:48–55` |
| **Async states** | `isSubmitting` (exists), `error` (new) |
| **Note** | Two sequential API calls: login first, then fetch stores. Access token must be stored before the stores fetch. |

---

### ✅ #2 — Signup

| | |
|---|---|
| **State update** | `clearStores()` → `setStores([])`, `setSelectedStoreId("")` |
| **Trigger** | Form submit (`AuthPage.tsx:44`) when `mode === "signup"` |
| **Mock** | Same 700ms setTimeout, then `onSignup()` |
| **API** | `POST /v1/auth/signup` → `AuthResponse { accessToken, user }` |
| **Call sites** | `AuthPage.tsx:61–66`, `App.tsx:57–60` |
| **Async states** | `isSubmitting` (exists), `error` (new) |

---

### ✅ #3 — Logout

| | |
|---|---|
| **State update** | `clearStores()` → `setStores([])`, `setSelectedStoreId("")` |
| **Trigger** | Button click (`Mypage.tsx:134`) via `onLogout` prop → `App.tsx:22–26` |
| **Mock** | Immediate, no async |
| **API** | **No logout endpoint in spec.** Token discard is client-side only for now. |
| **Call sites** | `Mypage.tsx:134`, `App.tsx:22–26` |
| **Async states** | None needed (client-side token clear only) |
| **Note** | Rewrite clears stored token and calls `clearStores()` synchronously. No API call until endpoint exists. |

---

### ✅ #4 — Create Store

| | |
|---|---|
| **State update** | `setIsCreating(true/false)`, `setCreatedStore({...})`, then `addStore(store)` → `setStores([...current, store])`, `setSelectedStoreId(store.id)` |
| **Trigger** | Form submit (`StoreOnboarding.tsx:101`) after confirmation |
| **Mock** | `window.setTimeout` 700ms, builds `StoreProfile` locally with generated `id` |
| **API** | `POST /v1/stores` with `CreateStoreRequest` → `StoreProfile` |
| **Call sites** | `StoreOnboarding.tsx:119–143`, `StoreOnboarding.tsx:172` → `onComplete()` → `App.tsx:16–20` |
| **Async states** | `isCreating` (exists), `error` (new) |
| **Note** | Form fields map directly to API fields. `initials` and `accent` must be computed client-side from the API response `name` field since they are not returned. |

---

### ✅ #5 — Fetch Reviews

| | |
|---|---|
| **State update** | `setReviews(...)` in `ReviewContext` |
| **Trigger** | Provider mount and `selectedStoreId` change |
| **Mock** | `const mockReviews = [...]` — not even a `useState`, just a const |
| **API** | `GET /v1/stores/{storeId}/reviews` → `StoreReview[]` |
| **Call sites** | `ReviewContext.tsx` — provider body, consumed by `useReviews()` in `InboxPage.tsx` |
| **Async states** | `loading` (new), `error` (new) |
| **Note** | `createMutationHook` applies: `requestFn` receives `storeId`, `apiFn` is the GET call, `updateFn` calls `setReviews`. Hook's `run(storeId)` is called inside `useEffect`. Field mapping required: `authorName→name`, `content→text`, `reviewedAt→time` (relative format), `id` stays as `string` (frontend `Review` type needs updating from `number` to `string`). |

---

### ✅ #6 — Generate Review Reply Draft

| | |
|---|---|
| **State update** | `setDraft(generatedText)`, `setSent(false)` |
| **Trigger** | "AI 답글 초안" button click (`InboxPage.tsx:147`) |
| **Mock** | `createDraft()` builds text from template string locally |
| **API** | `POST /v1/reviews/{reviewId}/ai-draft` → `AiDraftResponse { content }` |
| **Call sites** | `InboxPage.tsx:16–21` |
| **Async states** | `generating` (new — no loading state exists currently), `error` (new) |
| **Note** | `reviewId` comes from `selected.id`. After API success, `updateFn` calls `setDraft(response.content)` and `setSent(false)`. |

---

### ✅ #7 — Send Review Reply

| | |
|---|---|
| **State update** | `setSent(true)` |
| **Trigger** | "답글 게시" button click (`InboxPage.tsx:162`) |
| **Mock** | Immediate `setSent(true)`, no async |
| **API** | `POST /v1/reviews/{reviewId}/reply` with `ReplyRequest { content: draft }` → `StoreReview` |
| **Call sites** | `InboxPage.tsx:165–167` |
| **Async states** | `sending` (new), `error` (new) |

---

### ✅ #8a — Save Store Basic Info

| | |
|---|---|
| **State update** | `setSaved(true)` (feedback only; basic info fields are uncontrolled) |
| **Trigger** | "변경사항 저장" button click (`StoreProfilePage.tsx:27`) — same button as #8b |
| **Mock** | Immediate `setSaved(true)` + 2800ms timeout |
| **API** | `PUT /v1/stores/{storeId}/profile/basic` with `UpdateBasicRequest` → `StoreProfile` |
| **Call sites** | `StoreProfilePage.tsx:27–29` |
| **Async states** | `saving` (new, shared with #8b), `error` (new) |
| **Note** | Form fields use `defaultValue` (uncontrolled). Values read on submit via `event.currentTarget.elements` using `name` attributes. Fields needed: `name`, `phone`, `introduction` (maps from "소개글"), `address`, `category`, `toneOfVoice` (maps from "가게의 말투"). |

---

### ✅ #8b — Save Store Hours

| | |
|---|---|
| **State update** | `setSaved(true)` (same button as #8a, combined save action) |
| **Trigger** | Same "변경사항 저장" button click — runs in parallel with #8a |
| **Mock** | Covered by the same mock as #8a |
| **API** | `PUT /v1/stores/{storeId}/profile/hours` with `UpdateHoursRequest { businessHours: BusinessHour[] }` → `StoreProfile` |
| **Call sites** | `StoreProfilePage.tsx:27–29` |
| **Async states** | `saving` (shared with #8a), `error` (new) |
| **Note** | Context `hours` is `[dayKorean, openTime, closeTime][]`. Must map Korean day names to `dayOfWeek` enum (`월요일→MON`, etc.) and add `open: true` for all rows (no closed-day toggle in current UI). |

---

### ✅ #9 — Add Menu Item

| | |
|---|---|
| **State update** | `addMenu(item)` → `setMenus([...current, item])` |
| **Trigger** | "메뉴 추가" button click or Enter key (`StoreProfilePage.tsx:148, 140`) |
| **Mock** | Immediate local state update |
| **API** | `POST /v1/stores/{storeId}/profile/menus` with `AddMenuRequest { name, description }` → `StoreProfile` |
| **Call sites** | `StoreProfilePage.tsx:13–16` (handleAddMenu), line 148 button, line 140 Enter key |
| **Async states** | `addingMenu` (new), `error` (new) |
| **Note** | API requires `description` field; no description exists in current UI. Use empty string `""` for now. On success, `updateFn` calls `addMenu(response.menuItems.at(-1).name)` or replaces the full menu list from the returned `StoreProfile`. |

---

### ✅ #10 — Generate Content Draft

| | |
|---|---|
| **State update** | `setGenerating(true/false)`, `setTitle(...)`, `setBody(...)` |
| **Trigger** | "AI 초안 만들기" button click (`ComposeModal.tsx:160`) |
| **Mock** | `window.setTimeout` 700ms, template string using `store` prop |
| **API** | `POST /v1/stores/{storeId}/contents` with `CreateContentRequest { aiSuggest: true, eventText: intent }` → `ContentSuggestion { title, body }` |
| **Call sites** | `ComposeModal.tsx:71–81` (`generateDraft()`) |
| **Async states** | `generating` (exists), `error` (new) |

---

### ✅ #11 — Publish Content (ComposeModal)

| | |
|---|---|
| **State update** | `setPublished(true)`, then `onClose()` after 1500ms |
| **Trigger** | "게시하기" / "예약하기" button click (`ComposeModal.tsx:253`) |
| **Mock** | Immediate `setPublished(true)` + 1500ms timeout to close |
| **API** | `POST /v1/stores/{storeId}/contents` with `CreateContentRequest { title, body, channels, aiSuggest: false }` → `ContentItem` |
| **Call sites** | `ComposeModal.tsx:87–91` (`publish()`) |
| **Async states** | `publishing` (new), `error` (new) |
| **Note** | Same endpoint as #10 but with `aiSuggest: false`. On success, `updateFn` calls `setPublished(true)`. The 1500ms `onClose` delay stays as-is (UI timing, not async state). |

---

### ✅ #12 — Publish Content (ContentComposer)

| | |
|---|---|
| **State update** | `setPublished(true)` |
| **Trigger** | "지금 게시하기" button click (`ContentComposer.tsx:122`) |
| **Mock** | Immediate `setPublished(true)`, no async |
| **API** | `POST /v1/stores/{storeId}/contents` with `CreateContentRequest { body, channels: selectedTargets, aiSuggest: false }` → `ContentItem` |
| **Call sites** | `ContentComposer.tsx:122–128` |
| **Async states** | `publishing` (new), `error` (new) |
| **Note** | `title` field is uncontrolled in ContentComposer (uses `defaultValue`). Read via `event.currentTarget` or add a `ref`. |

---

### #13 — Save Account Profile

| | |
|---|---|
| **State update** | `setSaved(true)`, `setSaved(false)` after timeout |
| **Trigger** | "변경사항 저장" button click (`Mypage.tsx:27`) |
| **Mock** | Immediate `setSaved(true)` + 2500ms timeout |
| **API** | **No endpoint in spec.** `/v1/users/me` or equivalent does not exist. |
| **Call sites** | `Mypage.tsx:14–17` |
| **Async states** | N/A until endpoint exists |
| **Note** | Fields use `defaultValue` (uncontrolled). Pattern would be `event.currentTarget.elements` with `name` attributes when endpoint becomes available. Skip this update for now. |
