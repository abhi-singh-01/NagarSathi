# Contributing to NagarSathi (Mobile)

Thank you for helping improve NagarSathi! This app is open source under the MIT license.

## Repositories

| Repo | Purpose |
|------|---------|
| [NagarSathi](https://github.com/abhi-singh-01/NagarSathi) | React Native / Expo mobile app |
| [NagarSathi-API](https://github.com/abhi-singh-01/NagarSathi-API) | Node.js + Express + MongoDB backend |

## How to contribute

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally.
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make changes and test locally (`npm install`, `npx expo start`).
5. Commit with a clear message (no `Co-authored-by` bots unless you intend to).
6. Push to your fork and open a **Pull Request** against `main`.
7. Wait for review — a maintainer will merge after approval.

## What we do not accept in PRs

- `.env` files or API keys / MongoDB connection strings
- `.vscode/`, `.cursor/`, `.claude/` or other editor-only config
- `AGENTS.md`, `CLAUDE.md`, or AI-generated boilerplate docs
- Unrelated refactors or drive-by formatting

## Development setup

```bash
git clone https://github.com/abhi-singh-01/NagarSathi.git
cd NagarSathi
npm install
cp .env.example .env
# Set EXPO_PUBLIC_API_URL to your API (see NagarSathi-API repo)
npx expo start
```

## Code guidelines

- Match existing TypeScript style and folder layout under `app/` and `src/`.
- Keep PRs focused — one feature or fix per PR.
- Run `npx tsc --noEmit` and `npm run lint` before submitting.

## Questions?

Open a [GitHub Issue](https://github.com/abhi-singh-01/NagarSathi/issues) with the `question` label.
