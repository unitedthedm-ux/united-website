# UNITED Real Estate — Website

The official website for **UNITED Real Estate**, a property company in Egypt.
It showcases property listings, resale units, real-estate developers and their
compounds, and media — with a full bilingual (English / العربية) interface and
an admin panel for managing all content.

- **Live site:** https://unitedgroup-eg.com
- **Repository:** https://github.com/unitedthedm-ux/united-website

## Tech stack

| Area          | Technology                                  |
| ------------- | ------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19          |
| Language      | TypeScript                                  |
| Styling       | Tailwind CSS 4, shadcn / Base UI components |
| Database      | Supabase (PostgreSQL)                       |
| Image storage | Cloudflare R2 (S3-compatible)               |
| Hosting       | Vercel                                      |

> ⚠️ This project runs **Next.js 16**, which has breaking changes compared to
> older versions. See `AGENTS.md` before changing framework code.

## Running the project on a new device

1. **Install the prerequisites**
   - [Node.js](https://nodejs.org) 20.9 or newer
   - [Git](https://git-scm.com)

2. **Clone the repository**

   ```bash
   git clone https://github.com/unitedthedm-ux/united-website.git
   cd united-website
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   Copy `.env.example` to a new file named `.env.local` and fill in the real
   values (see the table below). `.env.local` is git-ignored — never commit it.

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000

## Environment variables

All of the following are required. Set them in `.env.local` for local
development **and** in the Vercel project settings (Settings → Environment
Variables) for production.

| Variable                              | Description                                  |
| ------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`            | Supabase project URL                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`       | Supabase public (anon) key                   |
| `SUPABASE_SERVICE_ROLE_KEY`           | Supabase service-role key — server only      |
| `CLOUDFLARE_ACCOUNT_ID`               | Cloudflare account ID                        |
| `CLOUDFLARE_R2_ACCESS_KEY_ID`         | Cloudflare R2 access key                     |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY`     | Cloudflare R2 secret key                     |
| `CLOUDFLARE_R2_BUCKET_NAME`           | R2 bucket name (e.g. `united-media`)         |
| `NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL`| Public URL of the R2 bucket                  |
| `ADMIN_PASSWORD`                      | Password for the `/admin` panel              |
| `NEXTAUTH_SECRET`                     | Random 32-character secret string            |

These values are secret — get them from the Vercel project or the project owner.

## Available scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the local development server   |
| `npm run build` | Create a production build            |
| `npm run start` | Run the production build locally     |
| `npm run lint`  | Run ESLint                           |

## Database

The PostgreSQL schema lives in the `supabase/` folder:

- `supabase/schema.sql` — all table definitions
- `supabase/seed-locations.sql` — seed data for locations

When setting up a fresh Supabase project, run these in the Supabase **SQL
Editor** (schema first, then the seed).

## Project structure

```
src/
  app/             Pages and API routes (Next.js App Router)
    page.tsx          Home page
    properties/       Property listings
    resale/           Resale units
    media/            Media / videos
    developers/       Developers and their compounds
    admin/            Admin panel (see below)
    api/              Backend API route handlers
  components/      Reusable UI — layout, property, admin, media
  context/         React context (language / locale)
  lib/             Shared helpers (Supabase clients, i18n text)
  types/           Shared TypeScript types
public/            Static assets (brand logos, etc.)
supabase/          Database schema and seed SQL
```

## Public pages

| Path                  | Page                                  |
| --------------------- | ------------------------------------- |
| `/`                   | Home                                  |
| `/properties`         | Property listings                     |
| `/resale`             | Resale units                          |
| `/media`              | Videos and social links               |
| `/developers`         | Developers list                       |
| `/developers/[slug]`  | A single developer and its compounds  |

## Admin panel

Go to `/admin/login` and sign in with `ADMIN_PASSWORD`. From there you can manage:

- **Listings** — properties for sale
- **Resale** — resale units
- **Developers & Compounds** — developers and their projects
- **Locations** — regions and areas
- **Team** — agents (each has their own WhatsApp / phone number)
- **Media** — videos

## Editing contact info & social links

- **Social links** (Facebook, Instagram, YouTube) and the **default WhatsApp
  number** are set directly in these files:
  - `src/components/layout/Footer.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/app/HomeClient.tsx`
  - `src/app/media/MediaClient.tsx`
- **Per-agent** WhatsApp / phone numbers are managed in the admin panel under
  **Team**.

## Deployment

- The project is hosted on **Vercel** and linked to this GitHub repository.
- **Every push to the `main` branch automatically builds and deploys to
  production.**
- Production domain: `unitedgroup-eg.com` (DNS managed by Vercel's nameservers).
- Make sure all environment variables are set in the Vercel project settings.
