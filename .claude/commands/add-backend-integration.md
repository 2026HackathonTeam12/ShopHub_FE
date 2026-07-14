## Skill: Add Backend Integration

### Goal

Implement a new backend-backed feature following the application's standard integration architecture.

---

### Procedure

#### Step 1. API Layer

Implement the required API functions in `src/api.ts`.

Use `docs/openapi.yaml` as the canonical API specification.

#### Step 2. Mutation Hook

Implement the corresponding mutation hook in `src/hooks` using the hook factory.

The hook must:

- construct the request,
- invoke the backend API,
- update the application store,
- expose asynchronous request state.

#### Step 3. Integration

Replace the existing implementation with the generated mutation hook.

Remove obsolete local state and mock update logic.

Reuse the existing store update logic whenever possible.

#### Step 4. Verification

Verify that:

- every intended interaction is backed by the implemented API,
- obsolete local application state has been removed,
- existing UI semantics are preserved,
- `npm run lint` completes without errors.
