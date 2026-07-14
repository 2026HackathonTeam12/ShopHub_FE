# Integrate UI Page

## Goal

Connect an existing UI-only page to the backend while preserving consistency across the project.

This skill assumes that:
- the UI has already been implemented,
- backend APIs may or may not exist,
- backend API specifications (OpenAPI or route definitions) are available.

This skill must NEVER invent backend endpoints.

## Inputs

Required:
- Target page
- Page checklist
- Backend API specification
- Existing frontend architecture
- Existing API client abstraction

## Expected Output

One of:
- API integration completed successfully

or
- Missing backend endpoints report

## Workflow

1. Read the page and identify:
   - displayed data
   - user actions
   - required backend operations

2. Find the corresponding backend endpoint for every operation.

3. If any required endpoint does not exist:
   - Stop.
   - Report the missing endpoint(s).
   - Do not generate frontend integration code.

4. Integrate the page using existing frontend architecture.
   - Reuse existing API client abstractions.
   - Follow existing coding conventions.

5. Verify:
   - endpoint exists
   - request/response types are correct
   - loading state works
   - error state works

## Rules

- Never invent endpoints.
- Never modify backend code.
- Never silently skip verification.
- Never skip missing endpoint detection.
- Prefer consistency over optimization.
- Follow existing architectural patterns.
- If uncertainty exists, stop and explain.
