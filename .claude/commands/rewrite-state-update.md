## Skill: Rewrite a State Update

### Input

One entry from **Artifact A**, consisting of:

- Trigger
- State update function
- API endpoint
- Consumption locations
- Required asynchronous local states

---

### Procedure

#### Step 1. Write the Hook

Implement the custom hook using the provided hook factory.

The hook should:

- Construct the request.
- Call the corresponding backend API.
- Invoke the existing state update function on success.
- Manage the required asynchronous local states.

Do not modify the existing state update logic unless absolutely necessary.

---

#### Step 2. Consume the Hook

Replace every consumption location identified in the Artifact A entry with the generated hook.

The resulting control flow should become:

```
Trigger
    ↓
Custom Hook
    ↓
API Request
    ↓
API Response
    ↓
Existing State Updater
    ↓
UI
```

---

#### Step 3. Verification

Verify the rewritten code satisfies all of the following:

1. The original state semantics are preserved.
2. Backend response data is passed to the state updater without unintended modification.
3. Success and failure paths are handled correctly.
4. Newly introduced asynchronous local states are correctly consumed by the UI.

If any requirement cannot be satisfied while preserving the existing architecture, stop the migration and report the issue instead of introducing architectural changes.

---

### Output

Produce:

- The implemented custom hook.
- The rewritten consumption sites.
- A verification report containing:
    - Semantic preservation
    - Async state handling
    - Any assumptions made
    - Any unresolved issues
