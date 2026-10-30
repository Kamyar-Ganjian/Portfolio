# Kamyar Ganjian — portfolio

Next.js App Router and TypeScript. Server-rendered project pages; repository-authored Markdown blog. No database or credentials required.

Use Node.js 22.18 or newer (the tests use native TypeScript stripping).

## Run and verify

- `npm ci`
- `npm run dev` — http://localhost:3000
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build` then `npm start`
- `npm test` — metadata, publication filtering, Markdown, and RSS escaping checks.

Deploy with a Next.js-compatible host (the existing production URL is on Vercel). All production URLs are centralized in `src/data/site.ts`: change `profile.url` before deploying to a different domain. Never set it to localhost. Published status is checked at build time for prerendered pages; redeploy to release scheduled posts or remove posts consistently.

## Publish a blog post

1. Add `content/blog/your-post-slug.md`. The filename becomes `/blog/your-post-slug`; use lowercase letters, numbers, and hyphens.
2. Start with this frontmatter (quote dates):

```yaml
---
title: "Your article title"
description: "A short summary for readers and social previews."
date: "2026-10-30"
tags: ["engineering", "nextjs"]
draft: true
---
```

3. Write Markdown below it. `content/blog/formatting-example.md` demonstrates headings, fenced code with language names, images, lists, quotes, and tables. Raw HTML is intentionally disabled. Put images under `public/blog/` and reference `/blog/filename.webp` with meaningful alt text. Prefer compressed images with consistent dimensions.
4. Run `npm run dev`. Drafts and future posts are hidden even locally. To preview, temporarily set `draft: false` and a date no later than today (UTC), then open `/blog/your-post-slug`. Restore draft status before committing unfinished writing. Never deploy the temporary preview state.
5. To publish, set `draft: false` with a current or past date, run lint, tests, and build, then commit and deploy. No component edits are necessary.
6. To update, edit the same file and optionally add `updated: "2026-11-01"` (not earlier than publication). Commit and redeploy. Keep the filename stable to preserve links.
7. To unpublish, set `draft: true` or remove the file, commit, and redeploy. The route returns 404 and is excluded from RSS and sitemap.

The listing is newest-first. Reading time uses 220 words/minute. Duplicate heading anchors receive stable numeric suffixes. Code has highlighting and keyboard-accessible copy buttons with announced feedback. Unsupported code languages render safely as plain text.

## Edit portfolio content

- Profile, role, links, email, production URL, project copy, and project links: `src/data/site.ts`.
- Employment, education, grouped skills: `src/app/about/page.tsx`.
- Homepage supporting copy: `src/app/page.tsx`.
- Résumé: replace `public/files/Kamyar_Ganjian_Frontend_engineer_CV.pdf`, or change `profile.resume`. The supplied PDF is preserved, including its original title and contact information.
- Design tokens, spacing, typography, responsive rules: `src/app/globals.css`.
- Local Geist font: `public/fonts/geist-latin.woff2`, bundled from the existing Next.js distribution.

## Evidence and privacy

Employment claims follow the supplied résumé and user-confirmed facts. CV Builder features follow its public repository README; GitHub City stack was checked against its public package.json. No private company photographs or proprietary interfaces are shown. The supplied résumé includes a phone number; it is not repeated in site content. Personal project screenshots and published articles were unavailable, so project pages are text-led and the blog has an honest empty state. Historical single-page anchors for projects, experience, contact, and top remain present on the homepage. Old components/data are retained as unused reference material.
