# Contributing to NagarSathi

Thank you for contributing! This repository is a **monorepo**:

| Folder | Stack |
|--------|--------|
| `mobile/` | Expo / React Native |
| `backend/` | Node.js / Express / MongoDB |

## How to contribute

1. **Fork** [NagarSathi](https://github.com/abhi-singh-01/NagarSathi) on GitHub.
2. **Clone** your fork.
3. Create a branch: `git checkout -b feature/your-feature`
4. Work in `mobile/` and/or `backend/` — test what you changed.
5. Open a **Pull Request** to `main` (maintainer approval required).

## Setup

```bash
git clone https://github.com/abhi-singh-01/NagarSathi.git
cd NagarSathi

# Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Mobile (new terminal)
cd mobile && npm install && cp .env.example .env && npx expo start
```

## PR rules

- No `.env`, API keys, or MongoDB URIs in the diff
- No `.vscode/`, `.cursor/`, `.claude/`, `AGENTS.md`, `CLAUDE.md`
- Run lint/typecheck in the folder you changed:
  - `mobile/`: `npx tsc --noEmit` && `npm run lint`
  - `backend/`: `npm run lint` && `npm run build`

## Questions

Open a [GitHub Issue](https://github.com/abhi-singh-01/NagarSathi/issues).
