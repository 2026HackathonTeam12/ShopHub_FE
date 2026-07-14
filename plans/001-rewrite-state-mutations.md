# Backend API Integration Plan

All stages complete.

## Goal

Integrate backend APIs into the existing mock-data-based application while preserving the existing UI state semantics as much as possible.

The primary objective is **ease of correctness verification**, not architectural improvement. To achieve this, the integration should minimize modifications to the existing codebase and reuse the current state model and state update logic whenever practical.

The integration strategy treats backend APIs as a new data source for the existing application rather than redesigning the application's state management.

---

## Non-goals

This migration intentionally does **not** aim to:

- Refactor or redesign the application's state architecture.
- Introduce new state management or caching libraries.
- Optimize performance or networking behavior.
- Change existing UI behavior or user interactions.
- Improve code quality beyond what is necessary for backend integration.

Any architectural improvements should be proposed separately rather than introduced during the migration.

---

## Summary

The existing application already defines the desired UI semantics through its state transitions.

Backend integration therefore follows a simple principle:

> Preserve the existing state semantics by replacing mock state updates with API-driven state updates.

For each user action,

```

User Action
↓
Custom Hook
↓
API Request
↓
API Response
↓
Existing State Update
↓
UI

```

Only the data source changes. Existing state update logic should remain unchanged whenever possible.

The only new local state introduced during the migration should be asynchronous request state (e.g. loading, error, disabled), which exists solely to represent the lifecycle of backend communication and does not replace the application's core state.

## Concrete Migration Steps

The migration should satisfy the following goals.

1. All local core states backed by mock data are removed.
2. The rewritten code preserves the original state semantics (i.e. the backend response is faithfully reflected without altering its intended meaning).
3. Newly introduced local asynchronous states are correctly consumed (loading, success, failure, disabled, etc.).

---

### Stage 0. Writing the Hook Factory

Before migrating individual state updates, implement a reusable hook factory that encapsulates the common backend integration workflow.

The generated hook should follow the standard control flow:

```
Trigger
    ↓
Construct Request
    ↓
API Call
    ↓
State Update
```

The factory should be configurable through the following components:

- Request construction function
- API function
- State update function

Error formatting should remain consistent across the application and therefore should not be configurable.

The generated hook is also responsible for managing the asynchronous request lifecycle, including loading and error states. Individual migrations should only supply the three functions above, allowing every API integration to share the same execution pattern.

#### Example

The intended usage is as follows:

```ts
const useCreateTodo = createMutationHook<CreateTodoRequest, CreateTodoResponse>()
    .request(/* construct request */)
    .api(todoApi.create)
    .update(/* existing state updater */)
    .build();
```

The generated hook can then be consumed by application code:

```ts
const { run, loading, error } = useCreateTodo();

await run(input);
```

Only the request construction, API call, and state update logic vary between integrations. The execution flow and asynchronous state management remain identical across all generated hooks.

### Stage 1. Identification

Identify all existing state update function calls in the codebase (search for setState uses).

For every state update function calls:

1. Identify the trigger (user action or lifecycle event).
2. Determine whether the update can be transformed into the standard API integration pattern.
3. If it cannot, report the reason instead of rewriting it.
4. Otherwise, identify:
   - the corresponding backend API endpoint,
   - every call site that performs the update,
   - the required local asynchronous states.

Produce **Artifact A**, consisting of a migration table of

```
- State update logic
- API endpoint
- Consumption locations
- Required async local states
```

No code should be modified during this stage.

---

### Stage 2. Rewrite

For each unchecked entry in Artifact A, execute rewrite-state-update skill.

### Stage 3. Final Verification

After all rewrites are complete, verify that:

1. All mock-backed local core states have been removed.
2. Every former state update is now backed by the corresponding backend API.
3. No obsolete mock update path remains.
