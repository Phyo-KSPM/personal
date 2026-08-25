# Ko Phyo

Personal workspace with a private login and notes, using Next.js and Supabase.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase (single-user)

1. Create a project at [supabase.com](https://supabase.com).
2. Copy **Project URL** and **anon / publishable key** into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. **Authentication → Providers → Email**: enable Email. Turn off **Confirm email** and **Allow new users to sign up**.
4. **Authentication → Users → Add user**: create your email and password.
5. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`
6. **SQL Editor**: paste and run `supabase/schema.sql` whenever the notes table changes.

After that, sign in on `/`. Notes live on `/home`, grouped in the sidebar:

- Network
- System
- DevOps
- Software

Upload a `.md` file into the matching topic, or write one in the editor.
