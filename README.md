# Smart Bookmark App

A modern bookmark manager built using Next.js, Supabase, and Tailwind CSS.  
Users can securely log in with Google, save personal bookmarks, and see real-time updates across multiple tabs.

---

## Live Demo

Deployed on Vercel:  
`https://your-app-name.vercel.app`

---

## Features

- Google OAuth authentication (Supabase Auth)
- Add bookmarks (Title + URL)
- Delete bookmarks
- Bookmarks are private per user
- Real-time updates across tabs (no refresh required)
- Responsive and modern UI
- Secure database with Row Level Security (RLS)

---

## Tech Stack

- Frontend: Next.js (App Router)
- Backend: Supabase (Auth, PostgreSQL, Realtime)
- Styling: Tailwind CSS
- Deployment: Vercel

---

## How It Works

- Users sign in using Google
- Bookmarks are stored securely in Supabase database
- Each user can only see their own bookmarks
- Realtime subscription updates UI instantly when data changes

---

## Local Setup

### 1. Clone repository

```bash
git clone https://github.com/yourusername/smart-bookmark-app.git
cd smart-bookmark-app
````

### 2. Install dependencies

```bash
npm install
```

### 3. Add Supabase credentials

Edit:

```
src/lib/supabaseClient.ts
```

Add:

```ts
const supabaseUrl = "YOUR_SUPABASE_URL"
const supabaseAnonKey = "YOUR_PUBLISHABLE_KEY"
```

---

### 4. Run development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Database Schema

Run in Supabase SQL Editor:

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text,
  url text,
  created_at timestamp default now()
);
```

Enable realtime:

```sql
alter publication supabase_realtime add table bookmarks;
```

---

## Deployment

Deploy easily using Vercel:

```bash
vercel
```

---

## Author

Chandni Gupta
---

## License

MIT License

```

If you want, I can also add **GitHub badges, screenshots, and demo GIF** to make it look top-tier.
```
