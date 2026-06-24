# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: read the bundled Next.js docs first

This project pins **Next.js 16.2.9 / React 19 / Tailwind v4**. Per `AGENTS.md`, the
installed Next.js may differ from training-data assumptions. Before writing routing,
data-fetching, caching, `Image`, fonts, or route-handler code, read the matching guide
under `node_modules/next/dist/docs/01-app/` (App Router). Note the README still says
"Next.js 14" — that is stale; trust `package.json`.

## Commands

```bash
npm run dev     # start dev server at http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint (next/core-web-vitals + next/typescript)
```

There is no test suite, no test runner, and no CI configured — `npm run lint` and a
successful `npm run build` are the only verification gates.

## Architecture

Single-page marketing/portfolio site for visual artist Ezequiel Torres. Content is in
Spanish. Design language is "Editorial Fluid": dark cinematic sections alternating with
light sections, serif display type (Playfair) over sans body (Inter), heavy
scroll-triggered motion.

- **`src/app/layout.tsx`** — root layout. Loads Google fonts as CSS variables
  (`--font-inter`, `--font-playfair`) and wraps all children in `LenisProvider`.
- **`src/components/LenisProvider.tsx`** — client component; mounts `ReactLenis` (root)
  for smooth scrolling site-wide. Lenis's required CSS lives at the bottom of
  `globals.css` — keep them together.
- **`src/app/page.tsx`** — the entire page. One large `"use client"` component holding
  every section (hero crossfade videos, about, Pinterest carousel, trayectoria, gallery,
  footer, floating social buttons) and all the `useState`/`useEffect`/Framer Motion
  logic. Adding a section means editing this file, not creating new component files —
  match the existing inline-section pattern.
- **`src/app/api/pinterest/route.ts`** — the only server code. Server-side proxy that
  fetches the artist's Pinterest RSS feed, regex-extracts image URLs, upgrades them from
  `236x` to `736x` resolution, dedupes, and returns the first 30. Exists to dodge CORS
  and cache the feed (`revalidate: 60`). `page.tsx` fetches `/api/pinterest` on mount.

## Styling conventions

- **Tailwind v4** — configured entirely in `globals.css` via `@import "tailwindcss"` and
  `@theme inline`. There is no `tailwind.config.js`. Theme tokens (`--color-background`,
  `--color-foreground`, `--font-sans`, `--font-serif`) are defined there; use `font-serif`
  for display headings and `font-sans` for body, matching existing sections.
- Section color scheme alternates deliberately: dark sections use `bg-[#111]`, light
  sections use `bg-[#FAFAFA]`. Brand accent colors are hardcoded per social platform
  (e.g. `#25D366` WhatsApp, `#E1306C` Instagram, `#FF0000` YouTube).
- `@/*` path alias maps to `src/*`.

## Assets

Hero videos (`/eze_torres_vid1.mp4`, `/eze_torres_vid2.mp4`) and gallery images live in
`public/` and are referenced by literal path. The Pinterest carousel uses `Image`
`unoptimized` because the sources are remote Pinterest URLs not whitelisted in
`next.config.ts`.
