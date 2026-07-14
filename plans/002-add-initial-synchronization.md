# Initial State Synchronization Plan

## Goal

Introduce initial state synchronization so that application state is correctly populated before any feature consumes it.

The goal is to preserve the existing application semantics while ensuring that all backend-backed state has a well-defined initialization point.

---

## Mental Model

Model the application as two phases:

```
Entry
    ↓
Initial Synchronization
    ↓
App
```

`Entry` consists of the application bootstrap and authentication flow.

`App` consists of the normal application after the required initial data has been synchronized.

The transition between the two phases is responsible for fetching and populating all required initial state. After entering `App`, the application should operate solely through the mutation hooks introduced during the backend migration.

## What to do

Identify the missing synchronizations, and implement them with the existing code pattern (custom hook).
