# Prompt Engineering: event registration portal

Registration and check-in site for the "Prompt Engineering" college event. Teams of 3 to 5 register, pay the fee and upload the payment screenshot, and organisers verify payments, scan QR codes at the door for attendance and export the team list.

## Features

- **3D landing page** with a Hyperspeed shader background (ogl / react-three-fiber) and the event rules.
- **Auth** with Supabase (email login and registration), protected routes through middleware.
- **Team dashboard**: create a team, add members, upload the payment screenshot to Cloudinary, see verification status.
- **Admin dashboard**: review teams and payments, approve or reject, and an **html5-qrcode scanner** page to mark attendance from each team's QR.
- **Export**: `/api/export/teams` writes the registered teams out through the Google APIs client.
- Row-level security policies for `teams` and `team_members` in `fix_complete_rls.sql` and `fix_team_members_policy.sql`.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres, RLS) · Cloudinary · Framer Motion · react-three-fiber + drei · html5-qrcode · googleapis

## Run locally

```bash
npm install
cp .env.example .env.local      # Supabase URL/anon key, Cloudinary cloud name/key/secret
npm run dev                     # http://localhost:3000
```

Run the two SQL files in the Supabase SQL editor after creating the `teams` and `team_members` tables. Give your own user the admin role to reach `/admin`.

## Layout

```
src/app/            landing, login, register, dashboard (create-team), admin (dashboard, scanner), api/export
src/components/     Hyperspeed background
src/utils/          Supabase server/client helpers
src/middleware.ts   session refresh and route protection
```
