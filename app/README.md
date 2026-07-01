# NeverAlone Sprint 1

Production baseline for NeverAlone mobile app.

## Run

```bash
npm install
npx expo start -c
```

## Env

Copy `.env.example` to `.env` and fill Supabase values.

## Architecture

Feature-first structure:

- `src/core` shared config, theme, i18n, Supabase and primitives
- `src/features` product features with components, hooks, services, types and screens
- `app` Expo Router routes
