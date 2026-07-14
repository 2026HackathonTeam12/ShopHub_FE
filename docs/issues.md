# Known Issues

## #8b — Hours grid initialized from hardcoded defaults

`StoreProfilePage.tsx` initializes the hours edit grid from `defaultHours` (a module-level constant), not from `store.businessHours`. As a result, a user who opens the Store Info page and clicks "변경사항 저장" without editing the hours will overwrite the server's stored hours with the hardcoded defaults.

**Resolution:** Initialize `useState(defaultHours)` from `store.businessHours` by mapping `BusinessHour[]` back to `[dayKorean, openTime, closeTime][]` (reverse of the `dayMap` used in `handleSave`). Out of scope for the current migration.
