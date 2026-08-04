# Vitalist

An app to help people age well by building healthy habits — health tracking plus longevity content from People Inc.

## Stack

- `client/` — React + Vite frontend
- `server/` — Node + Express API

## Getting started

Install dependencies for both apps:

```
cd server && npm install
cd ../client && npm install
```

Run both in separate terminals:

```
cd server && npm run dev   # http://localhost:4000
cd client && npm run dev   # http://localhost:5173
```

The client proxies `/api` requests to the server during development.

## API routes (placeholder)

- `GET /api/health` — server health check
- `GET/POST /api/habits` — habit list and creation; `POST /api/habits/:id/complete` to log a completion
- `GET/POST /api/tracking` — health/vitals entries
- `GET /api/content` — longevity content feed (stub for People Inc. integration)

All data is in-memory right now — swap in a real database when ready.

## Branding

Visual design/branding is not yet applied. It will be based on the
[Health.com design system in Figma](https://www.figma.com/design/vNcLIOeTecg7QL2sElBba4/Health.com-Design-System) —
see `docs/design-system.md` for the extracted color and typography tokens.
