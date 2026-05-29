# NagarSathi Mobile App

React Native **Expo** app for reporting civic issues in India.

Parent monorepo: [NagarSathi](../README.md)

## Features

- Login & signup
- Photo + GPS complaint capture
- Categories: pothole, garbage, streetlight, water, sewage
- Map, history, status tracking
- Hindi + English UI labels

## Setup

```bash
cd mobile
npm install
cp .env.example .env
npx expo start
```

### Connect to API

In `.env`:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.33:3000
```

Use your PC LAN IP on a physical device (not `localhost`).

### Demo mode

Without `EXPO_PUBLIC_API_URL`, the app uses local AsyncStorage demo data.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Expo dev server |
| `npm run android` | Open Android |
| `npm run lint` | ESLint |

## Structure

```
mobile/
├── app/          # Expo Router screens
├── src/          # API, services, components, contexts
└── assets/
```
