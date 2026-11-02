# MHI — MedSense Watch

Official landing page for **MedSense Watch** by **MHI (Molecular Health Intelligence)** — a modular wearable platform integrating continuous physiological sensing, non-invasive MIP sweat bioanalysis, capillary microfluidics, and personalized longitudinal AI.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Animations & Interactivity:** Motion (`motion/react`), custom analytical SVGs (2D molecular structures, 3-electrode DPV microfluidic cell, 7-layer scroll exploded view, live multi-screen Watch OS showcase, native companion app prototype)
- **Forms & Validation:** React Hook Form + Zod v4 (`POST /api/contact` with honeypot, submission timing check, per-IP rate limiting, and optional webhook forwarding)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Configuration

- **Brand & Product Metadata:** `src/lib/site.ts`
- **Biomarkers, Sensors, Applications & Cartridges:** `src/data/*.ts`
- **Optional Environment Variables (`.env.local`):**
  - `NEXT_PUBLIC_SITE_URL` — canonical deployment URL
  - `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
  - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Plausible analytics domain
  - `LEAD_WEBHOOK_URL` — webhook endpoint to forward captured partnership inquiries
