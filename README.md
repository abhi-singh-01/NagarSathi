# NagarSathi (नगर साथी)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Expo SDK 54](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev)

Open-source **civic complaint platform for India** — report potholes, garbage, broken streetlights, water leaks, and sewage with geo-tagged photos and GPS tracking.

🤝 [Contributing](CONTRIBUTING.md) — fork, pull request, maintainer review before merge.

## Monorepo structure

```
NagarSathi/
├── mobile/          # React Native Expo app (Android / iOS)
├── backend/         # Node.js Express API + MongoDB + Docker
├── LICENSE
└── CONTRIBUTING.md
```

| Folder | Description | Docs |
|--------|-------------|------|
| [`mobile/`](mobile/) | Citizen-facing mobile app | [mobile/README.md](mobile/README.md) |
| [`backend/`](backend/) | REST API, auth, complaints, uploads | [backend/README.md](backend/README.md) |

## Quick start (full stack)

**1. Backend API**

```bash
cd backend
cp .env.example .env
npm install
npm run dev
# Health: http://localhost:3000/health
```

Or with Docker: `cd backend && docker compose up --build`

**2. Mobile app**

```bash
cd mobile
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
npx expo start
```

## License

MIT — see [LICENSE](LICENSE).
