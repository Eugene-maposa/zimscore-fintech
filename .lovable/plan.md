## Plan: Fix CSS warning and enable leaked password protection

### 1. Fix CSS `@import` order warning
In `frontend/src/index.css`, the Google Fonts `@import` is currently placed after the `@tailwind` directives, which violates CSS spec (`@import` must come first) and triggers a PostCSS warning.

**Change:** Move the `@import url('https://fonts.googleapis.com/...')` line to the very top of the file, above the three `@tailwind` directives.

### 2. Enable Leaked Password Protection
Use the auth configuration tool to turn on the HIBP (Have I Been Pwned) check, so users cannot register or change to passwords that have appeared in known data breaches.

**Change:** Set `password_hibp_enabled: true` while preserving current settings (signup enabled, no anonymous users, no auto-confirm email).

### No other changes
No business logic, UI, or database changes. The credit scoring, registration camera, and dashboard flows remain untouched.