# MHI — MedSense Watch

Official landing page for **MedSense Watch** by **MHI (Molecular Health Intelligence)** — a modular wearable platform integrating continuous physiological sensing, non-invasive MIP sweat bioanalysis, capillary microfluidics, and personalized longitudinal AI.

## Tech Stack

- **Framework:** Next.js 15 (App Router, configured with `output: "export"` for static deployment on Cloudflare Pages) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Animations & Interactivity:** Motion (`motion/react`), custom analytical SVGs (2D molecular structures, 3-electrode DPV microfluidic cell, 7-layer scroll exploded view, live multi-screen Watch OS showcase, native companion app prototype)
- **Forms & Validation:** React Hook Form + Zod v4, compatible with the standalone Cloudflare Pages Function (`functions/api/contact.js`) or an external form endpoint (`NEXT_PUBLIC_CONTACT_ENDPOINT`)

## Local Development & Static Build

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Generates static export in ./out
```

## Cloudflare Pages Deployment

- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Optional Environment Variables:**
  - `NEXT_PUBLIC_SITE_URL` — canonical deployment URL
  - `NEXT_PUBLIC_CONTACT_ENDPOINT` — optional external form endpoint (defaults to `/api/contact` handled by `functions/api/contact.js`)
  - `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
  - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — Plausible analytics domain
  - `LEAD_WEBHOOK_URL` — webhook endpoint in Cloudflare Pages to forward captured partnership inquiries
