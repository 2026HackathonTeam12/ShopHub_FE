## Skill: Identify Dangling Local States

### Goal

Identify all remaining application state that has not yet been migrated to the backend-backed state model.

Both explicit local state and hidden state should be inspected.

---

### What to Inspect

Inspect the target component for:

- useState
- useReducer
- Context-local state
- Refs used as application state
- Derived state
- Effects synchronizing local state
- Remaining hidden mock data: check for "mock" signals.

Hidden mock data example:

<div className="mt-5 grid gap-4 sm:grid-cols-2">
  <Field label="이름" defaultValue="김지인" />
  <Field label="휴대폰 번호" defaultValue="010-3492-0426" />
  <div className="sm:col-span-2">
  <Field label="이메일" defaultValue="jiin@momo-coffee.kr" />
  </div>
</div>

For every candidate, determine whether it represents:

- Application state
- UI-only state

UI-only state (loading, error, disabled, modal visibility, input drafts, etc.) should not be migrated.

---

### Output

Produce (or update) `docs/dangling-state.md`.

The document should organize remaining application state previously identified into managable **migration units**, for ease of refactoring.

Each migration unit should contain:

- Name
- Files involved
- Current state update path
- Corresponding backend API
- Dependency on other migration units
- Notes / edge cases

Each unit should be independently migratable.
