# NagarSathi API

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Production-ready **Node.js + Express + MongoDB** REST API for the NagarSathi civic complaint platform.

Part of the [NagarSathi monorepo](../README.md) · Mobile app: [`../mobile`](../mobile)

🤝 [Contributing](../CONTRIBUTING.md) — pull requests require maintainer approval before merge.

## Features

- JWT user authentication (signup, login, me, logout)
- Complaint CRUD with multipart image upload
- MongoDB with **2dsphere** geospatial index
- Nearby complaints API (`/complaints/nearby`)
- Status history tracking
- Rate limiting, helmet, CORS, compression
- Static serving of uploaded photos

## Docker (recommended for testing)

```bash
cp .env.example .env
# Optional: edit JWT_SECRET in docker-compose.yml or .env

docker compose up --build
```

| Service | URL |
|---------|-----|
| API health | http://localhost:3000/health |
| MongoDB | `localhost:27017` (container only) |

**With MongoDB Atlas** (your cloud DB):

```bash
cp .env.example .env   # paste Atlas MONGODB_URI — do not commit .env
docker compose -f docker-compose.atlas.yml up --build
```

## Quick Start (without Docker)

### Prerequisites

- Node.js 18+
- **MongoDB Atlas** account (free tier works) — [mongodb.com/atlas](https://www.mongodb.com/atlas)

### MongoDB Atlas setup

1. Create a free **M0 cluster** on MongoDB Atlas.
2. **Database Access** → Add user (username + password). Save the password.
3. **Network Access** → Add IP Address:
   - Your current IP for security, or
   - `0.0.0.0/0` for development (allow from anywhere).
4. **Database** → **Connect** → **Drivers** → copy the connection string.
5. Replace `<password>` with your user password (URL-encode special characters).
6. Ensure the database name is `nagarsathi` in the URI:
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/nagarsathi?retryWrites=true&w=majority
   ```

### Setup

```bash
cd nagarsathi-backend
npm install
cp .env.example .env
# Edit .env — paste your Atlas MONGODB_URI, JWT_SECRET, BASE_URL
npm run dev
```

You should see: `MongoDB connected: nagarsathi @ MongoDB Atlas (cloud)`

API runs at `http://localhost:3000` (listens on `0.0.0.0` for device access).

### Connect Expo app

In `NagarSathi/.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3000
```

Use your PC's LAN IP (e.g. `192.168.1.33`), not `localhost`, when testing on a physical phone.

Set `BASE_URL` in backend `.env` to the same URL so photo links work on device.

## API Reference

### Auth

| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/auth/signup` | No | `{ name, email, password, phone? }` |
| POST | `/auth/login` | No | `{ email, password }` |
| GET | `/auth/me` | Bearer | — |
| POST | `/auth/logout` | Bearer | — |

**Response (signup/login):**
```json
{
  "user": { "id", "name", "email", "phone", "createdAt" },
  "tokens": { "accessToken": "..." }
}
```

### Complaints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/complaints` | No | All complaints (mobile map) |
| GET | `/complaints/mine` | Bearer | Current user's complaints |
| GET | `/complaints/nearby` | No | Geospatial nearby search |
| GET | `/complaints/:id` | No | Single complaint |
| POST | `/complaints` | Bearer | Create (multipart) |
| PATCH | `/complaints/:id` | Bearer | Update description/status |
| DELETE | `/complaints/:id` | Bearer | Delete (owner only) |

### Create complaint (multipart/form-data)

| Field | Type | Required |
|-------|------|----------|
| photo | file | Yes |
| category | string | Yes |
| description | string | Yes (10–500 chars) |
| latitude | number | Yes |
| longitude | number | Yes |
| address | string | No |
| accuracy | number | No |

**Categories:** `pothole`, `garbage`, `broken_streetlight`, `water_leakage`, `sewage`

**Statuses:** `submitted`, `in_review`, `in_progress`, `resolved`, `rejected`

### Nearby complaints

```
GET /complaints/nearby?latitude=28.6139&longitude=77.2090&radius=5000&limit=50&category=pothole
```

| Param | Default | Description |
|-------|---------|-------------|
| latitude | required | Center latitude |
| longitude | required | Center longitude |
| radius | 5000 | Search radius in **meters** (100–50000) |
| limit | 50 | Max results (1–100) |
| category | optional | Filter by category |

## Production

```bash
npm run build
NODE_ENV=production npm start
```

Recommendations:
- MongoDB Atlas uses TLS automatically (`mongodb+srv://`)
- Set strong `JWT_SECRET` (32+ random chars)
- Set `CORS_ORIGIN` to your app domains
- Put nginx/Caddy in front for HTTPS
- Store uploads on S3/Cloudinary for scale (current: local `uploads/`)

## Health check

```
GET /health
```

## Project structure

```
src/
├── config/       env, database
├── controllers/  auth, complaints
├── middleware/   auth, upload, validate, errors
├── models/       User, Complaint
├── routes/
├── utils/
├── app.ts
└── index.ts
```
