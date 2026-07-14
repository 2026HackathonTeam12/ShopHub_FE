## Skill: Fix ESLint Issues

### Goal

Resolve ESLint violations while preserving the existing code semantics.

The objective is to eliminate lint errors through straightforward, conventional fixes. Do not perform refactoring or introduce ad-hoc code changes solely to satisfy the linter.

---

### Procedure

#### Step 1. Run ESLint

Execute:

```sh
npm run lint
```

Collect all reported diagnostics.

---

#### Step 2. Identify the Problems

For each reported issue:

1. Identify the violated rule.
2. Determine the affected code.
3. Classify whether the fix is trivial.

Examples of trivial fixes include:

- Removing unused imports or variables.
- Adding missing dependencies where mechanically correct.
- Reordering imports.
- Applying formatting or syntax fixes.
- Replacing deprecated syntax with the standard equivalent.

---

#### Step 3. Apply Fixes

For each issue:

- If the fix is trivial and preserves semantics, apply it.
- Otherwise, do **not** introduce architectural, ad-hoc, or speculative changes merely to silence ESLint.

Instead, report:

- the violated rule,
- why the issue is non-trivial,
- and what architectural decision would be required to resolve it.

---

### Verification

Run

```sh
npm run lint
```

again.

Verify that:

- All trivial issues have been resolved.
- No new lint errors have been introduced.
- Existing program semantics remain unchanged.

---

### Output

Produce:

- The modified files.
- Any remaining ESLint diagnostics.
- A report explaining why each remaining issue was intentionally left unresolved.
