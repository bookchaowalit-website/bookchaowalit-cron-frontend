# Cron Expression Helper

Visual cron builder with human-readable explanation and next-run previews.

## Features
- 5-field cron (minute hour dom month dow)
- Presets (hourly, daily, weekly, …)
- Next N run estimates (client-side)

## Limitations
- Standard 5-field only (no seconds / Quartz)
- Next-run calculator is a practical estimate, not a full cron library

## Run
```bash
npm install
npm run dev
```

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Fully client-side (no API keys)

## Honesty notes
- Portfolio developer utility showcase
- Not a multi-tenant SaaS product
