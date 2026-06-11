# ChainFinity Mobile (Expo)

Native mobile app for the ChainFinity platform, built with Expo and
expo-router. This replaces the previous Next.js implementation in this
directory, which was a web application (Radix, MUI, Tailwind, DOM APIs) and
could not run on a device.

## Stack

- Expo SDK 52, React Native 0.76, React 18
- expo-router file-based navigation (app/ directory, analogous to the Next
  App Router structure it replaces)
- AsyncStorage session persistence
- Axios API client aligned to the backend's /api/v1 routes
- Jest via jest-expo with @testing-library/react-native

## Screens

| Route         | Purpose                                      |
| ------------- | -------------------------------------------- |
| /             | Landing with sign-in / register entry points |
| /login        | Email + password sign in, guest demo mode    |
| /register     | Account creation with client-side validation |
| /dashboard    | Portfolio total, asset list, pull to refresh |
| /transactions | History with search and type filters         |
| /settings     | Profile summary and sign out                 |

When the backend is unreachable, the data hooks fall back to mock data so
the app remains explorable, and the guest login (guest@chainfinity.io)
works fully offline.

## Configuration

Copy `.env.example` to `.env` and set the backend URL:

```
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_HOST:8000
```

Note for physical devices: localhost refers to the phone itself. Use your
machine's LAN IP (for example http://192.168.1.20:8000) so the device can
reach the backend.

## Commands

```
npm install
npm start          # Expo dev server; scan the QR with Expo Go
npm run android    # open on a connected Android device / emulator
npm run ios        # open on an iOS simulator (macOS only)
npm test           # Jest unit and component tests
npm run typecheck  # TypeScript validation
```

## Tests

42 tests across 5 suites cover the helpers, the API error handling and
versioned endpoint paths, the auth context (login, demo mode, persistence,
401 handling, logout), the data hooks (wallet resolution, mock fallback,
stable dependencies), and screen behavior (login validation, dashboard auth
gate, transaction filtering).
