# NagarSathi (नगर साथी)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev)

Open-source **React Native Expo** civic complaint app for India. Citizens report potholes, garbage, broken streetlights, water leaks, and sewage issues with photo evidence and precise GPS — then track resolution status on a map.

> **Backend API** (Express + MongoDB): see the `nagarsathi-backend` folder in this monorepo or a separate API repository.

## Features

- User login & signup (secure token storage)
- Camera capture for complaint photos
- High-accuracy GPS + reverse geocoding
- 5 complaint categories (English + Hindi labels)
- Description with validation
- Backend upload (live API or local demo mode)
- Map of all complaints with markers
- Complaint history list
- Status tracking with timeline
- Modern Indian civic UI (teal + tricolor accents)
- Android permission handling (camera, location, photos)
- Organized `src/` folder structure

## Project Structure

```
NagarSathi/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login, signup
│   ├── (tabs)/             # Home, map, history, profile
│   └── complaint/          # New complaint, detail
├── src/
│   ├── api/                # Axios client & endpoints
│   ├── components/         # UI, complaint, layout
│   ├── constants/          # Theme, categories
│   ├── contexts/           # Auth & complaints state
│   ├── hooks/              # Location, permissions
│   ├── services/           # Auth, complaints, location, permissions
│   ├── types/              # TypeScript models
│   └── utils/              # Validation, formatting
└── assets/
```

## Quick Start

```bash
cd NagarSathi
npm install
npx expo start
```

Press `a` for Android emulator or scan the QR code with **Expo Go**.

### Demo Mode (default)

Without `EXPO_PUBLIC_API_URL`, the app runs in **local demo mode**:
- Auth & complaints persist via AsyncStorage
- Sample complaints seed on first load
- Status auto-updates to "Under Review" after 10 seconds

### Production Backend

Copy `.env.example` to `.env` and set your API:

```env
EXPO_PUBLIC_API_URL=https://api.yourbackend.com
```

Expected endpoints (see `src/api/endpoints.ts`):
- `POST /auth/login`, `POST /auth/signup`, `GET /auth/me`
- `GET /complaints`, `POST /complaints` (multipart with photo)

## Android Permissions

Configured in `app.json`:
- `CAMERA` — complaint photos
- `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION` — GPS pinning
- `READ_MEDIA_IMAGES` — gallery upload (Android 13+)

Runtime permission prompts use `expo-image-picker` and `expo-location` plugins.

## Google Maps (Android)

For production map tiles on Android, add your API key in `app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
    }
  }
}
```

## Tech Stack

- Expo SDK 54 · React Native 0.81
- Expo Router (file-based navigation)
- react-native-maps · expo-location · expo-image-picker
- axios · expo-secure-store · async-storage

## Docker (backend only)

The **mobile app does not run in Docker** — use Expo on your phone/emulator. Docker is for the **API**:

```bash
cd nagarsathi-backend   # clone/publish API repo separately
docker compose up --build
# API → http://localhost:3000/health
```

Atlas: `docker compose -f docker-compose.atlas.yml up --build` with `.env` (never commit `.env`).

## License

MIT
