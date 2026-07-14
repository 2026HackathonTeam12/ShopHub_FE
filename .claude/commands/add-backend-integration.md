## Skill: Add Backend Integration

### Goal

Introduce a new backend-backed feature following the application's standard mutation architecture.

---

### Procedure

#### Step 1. API Layer

Implement the required API functions in `src/api.ts`. Refer to
`docs/openapi.yaml` for reference.

#### Step 2. Mutation Hook

Create the corresponding mutation hook in `hooks/` using the hook factory.

The hook should:

- construct requests,
- call the backend,
- update the store,
- expose async state.

#### Step 3. Hook Consumption

Replace existing implementation with the generated mutation hook.
Remove obsolete local states.

#### Step 4. Verification

Verify:

- API integration is complete.
- Local application state has been removed.
- Existing UI semantics are preserved.
- `npm run lint` succeeds.
