# Application Mental Model

## State Model

The application follows a single-source-of-truth (SSOT) model.

### Local Store (`src/stores`)

The local store is the authoritative application state.

All components should derive application state exclusively from the local store rather than directly from backend responses.

Application state should only be modified through store update functions.

### Mutation Hooks (`src/hooks`)

Mutation hooks encapsulate backend communication.

Their responsibilities are limited to:

- constructing requests,
- calling backend APIs,
- updating the local store,
- exposing asynchronous request state (e.g. loading and error).

Mutation hooks do **not** own application state. They exist solely to synchronize backend mutations with the local store.

---

## Application Flow

The application consists of two phases:

```
Authentication
        │
        ▼
Initial Synchronization
        │
        ▼
Application
```

Authentication establishes the user's identity.

Initial Synchronization populates the local store with all application state required before entering the application.

After entering the application, all subsequent state changes occur through mutation hooks.

---

## State Invariants

The following invariants should always hold.

### Authentication

Before entering the application:

- Authentication has completed.
- Required credentials are available.
- Application state has not yet been synchronized.

### Application

After entering the application:

- Every piece of application state is backed by the local store.
- Every backend mutation updates the local store.
- Components consume only the local store.

### Centralized Initial Synchronization

Initial synchronization is centralized.

A single application-level component is responsible for synchronizing the initial application state before it is consumed elsewhere.

Individual pages and feature components must **not** perform their own application-level synchronization.

Application-level synchronization should occur only at the transition from **Authentication** to **Application**, ensuring a single, well-defined initialization path for the entire application.
