# MHI — MedSense Watch

Official landing page for **MedSense Watch** by **MHI (Molecular Health Intelligence)** — a modular wearable platform integrating continuous physiological sensing, non-invasive MIP sweat bioanalysis, capillary microfluidics, and personalized longitudinal AI.

## Tech Stack

- **Framework:** Next.js 15 (App Router, `output: "export"` static export) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4
- **Animations & Interactivity:** Motion (`motion/react`), custom analytical SVGs (2D molecular structures, 3-electrode DPV microfluidic cell, 7-layer scroll exploded view, live multi-screen Watch OS showcase, native companion app prototype)
- **Forms & Validation:** React Hook Form + Zod v4 (`NEXT_PUBLIC_CONTACT_ENDPOINT` optional external endpoint with static fallback)

## Local Development & Static Build

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Generates static export in ./out
```

## Cloudflare Workers Deployment (`wrangler.jsonc`)

- **Worker name:** `mhi-medsensewatch`
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Static assets directory:** `./out` (`not_found_handling: "404-page"`)
