# Marketplace

A simple no-login marketplace built with Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn-style UI primitives, and Supabase.

## Features

- Browse public listings, newest first
- Filter by category and search by title
- Create a listing with title, description, PHP price, seller email, category, location and photo
- Upload listing photos to Supabase Storage
- Open a dedicated listing detail page
- Send a message to the seller (stored in Supabase)
- No login or registration

## Setup

1. Create a Supabase project.
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Fill in your Supabase project URL and anon/publishable key.
5. Install and run:

```bash
npm install
npm run dev
```

6. Open http://localhost:3000.

## Supabase environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Use only the anon/publishable key in the browser. Never expose a service-role key.
