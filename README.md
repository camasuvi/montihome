# MontiHome

Montessori-inspired, multi-language activity and guide library for parents and educators. Built with Next.js 14, TypeScript, Tailwind, Prisma (PostgreSQL) and next-intl.

## Tech Stack
- Next.js 14 (App Router) + TypeScript + React
- Tailwind CSS
- PostgreSQL via Prisma ORM
- i18n with next-intl (localized routes `/[locale]/...`)
- No user auth for public; simple admin password via env for `/admin`

## Project Structure
- `app/[locale]/*`: Public localized routes (landing, activities, guides, my-plan, about)
- `app/admin/*`: Admin routes (login, dashboard, activities, guides, settings)
- `app/api/*`: API routes (e.g. `/api/activities`)
- `components/*`: Reusable UI components
- `lib/*`: Prisma client, i18n helpers
- `messages/*`: Translation JSON files
- `prisma/*`: Prisma schema and seed

## Environment Variables
Create `.env` with:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
ADMIN_PASSWORD="set-a-strong-password"
```

## Setup
1) Install dependencies
```
npm install
```

2) Prisma generate and migrate (create tables)
```
npx prisma generate
npx prisma migrate dev --name init
```

3) Seed sample data
```
npm run prisma:seed
```

4) Run dev server
```
npm run dev
```
App will be available at `http://localhost:3000/en` (middleware defaults to English).

## Admin
- Admin login: `http://localhost:3000/admin/login`
- Protects `/admin/*` with a cookie issued when the provided password matches `ADMIN_PASSWORD`.
- Admin can manage Activities, Guides and toggle site visibility (Public/Private).

## i18n
- Locales: `en` (default), `tr`
- All public routes are prefixed with locale: `/en/...`, `/tr/...`
- Translation files: `messages/en.json`, `messages/tr.json`

## Site Visibility
- `SiteSettings.isPublic` controls whether public localized pages are visible.
- When `false`, public `[locale]` pages show a “Private / Coming soon” page.
- Admin area remains accessible.

## Deploy (Vercel)
1) Push this repo to GitHub/GitLab.
2) Create a new Vercel project and import repo.
3) Set Environment Variables in Vercel:
   - `DATABASE_URL` (from Neon/Supabase, etc.)
   - `ADMIN_PASSWORD`
4) Run `npx prisma migrate deploy` in a one-off job or via a post-deploy script.
5) Set “Build Command” to `npm run build` and “Install Command” to `npm install`.

## Notes
- My Plan uses localStorage only (per-device); no accounts or server state.
- Activity translations fallback to English if the current locale is not available.


