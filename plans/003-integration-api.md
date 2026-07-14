# Platform Integration Plan

## Stage 0. Platform ID Migration

### What's Changed

The application currently treats human-readable platform names (e.g. `"Instagram"`) as the canonical representation.

This stage migrates the application to use backend-defined **platform IDs** as the canonical representation. Human-readable names become presentation-only data obtained through a centralized mapping.

### Implementation

#### Static Platform Metadata

Introduce a dedicated module containing:

- The complete list of supported platform IDs.
- metadata: (1) whether they can be integrated. (2) human-readable names.name.

This module becomes the single source of truth for platform metadata.

The list of platform IDs:

`INSTAGRAM`,
`NAVER_BLOG`,
`FACEBOOK`,
`MOCK_MAP`,
`KAKAO_MAP`,
`GOOGLE_MAP`,
`NAVER_MAP`

only MOCK_MAP is available for now.

#### Review Page

- Replace direct usage of human-readable platform names with platform IDs.
- Render platform names exclusively through the human-readable name.

#### Content Page

- Update platform selection to use platform IDs internally.
- Render platform as their name. wherever they are displayed.

#### Store Profile & Onboarding

- Update the mocked store data to use platform IDs instead of human-readable names.
- Render connected platform names as their name.
- Render the 'available' information.

### Verification

Verify that:

- Every migrated page stores platform IDs instead of human-readable names.
- Every displayed platform name is human-readable.
- No hardcoded platform names remain in migrated pages.

---

## Stage 1. Integration State

### What's Changed

Introduce integration state into the application store.

Platform integrations become part of each store's application state rather than static data.

### Implementation

#### Store State

- Add integration state to the stores context.
- Each store owns its own integration list.

#### Workspace Synchronization

- Treat integrations as per-store state within `WorkspaceRoot`.
- Ensure integration state participates in the existing application synchronization model.

#### Content Page

- Replace hardcoded platform selection with state consumed from the store.
- Platform selection should reflect the integrations available for the currently selected store.

---

## Stage 2. Backend Integration

### What's Changed

Replace mocked platform integration with backend-backed integration.

### Implementation

Apply the standard backend integration workflow to:

- Onboarding
- Store Profile

Implement:

- API layer
- Mutation hook
- Hook consumption

Remove obsolete mock update logic where applicable.

### Verification

Verify that:

- Platform integrations are fetched and updated through the backend.
- Obsolete local application state has been removed.
- Existing UI semantics are preserved.
- `npm run lint` succeeds.
