# Admin Setup

## 1. Run the database migration

### Option A: Supabase CLI (like Laravel’s `php artisan migrate`)

1. **Install the Supabase CLI** (one time):
   ```bash
   npm install -g supabase
   ```
   Or use without installing: `npx supabase` in the commands below.

2. **Log in to Supabase CLI** (one time). Opens a browser to authenticate:
   ```bash
   npx supabase login
   ```

3. **Link your project** (one time). From the project root:
   ```bash
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   **Where to get the project ref:** It’s the short ID (about 20 letters), not the full URL.
   - In the browser: open your project in [Supabase Dashboard](https://supabase.com/dashboard). The URL is `https://supabase.com/dashboard/project/XXXXXXXX` — use only the **XXXXXXXX** part (e.g. `abcdefghijklmnopqrst`).
   - Or: Project Settings → General → **Reference ID**.
   Use only that ID (no `https://`, no `.supabase.co`, no slashes). When prompted, enter your database password.

4. **Run migrations**:
   ```bash
   npm run db:migrate
   ```
   Or: `npx supabase db push`

   To see migration status: `npm run db:migrate:status` or `npx supabase migration list`.

   **Alternative to login:** Set `SUPABASE_ACCESS_TOKEN` (from [Supabase Account → Access Tokens](https://supabase.com/dashboard/account/tokens)) instead of running `supabase login`.

### Option B: Run SQL manually in the Dashboard

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Copy the contents of `supabase/migrations/20250203000000_portfolio_content.sql`.
3. Paste and run the script to create the `portfolio_content` table and RLS policies.

## 2. Create an admin user

1. In Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter an **Email** and **Password** (or use "Generate a password" and save it).
3. Confirm the user. This user can sign in at `/jerald-portal/login` to edit portfolio content.

## 3. Sign in

- Open `/jerald-portal/login` on your site and sign in with the email and password you created.
- After login you can use **Admin** → **Edit portfolio content** to change all page content (hero, about, experience, projects, etc.).

## Proxy (middleware)

The app uses Next.js proxy (`proxy.ts`) to:

- Refresh the Supabase auth session on each request.
- Protect `/jerald-portal` and `/jerald-portal/*` (except `/jerald-portal/login`): unauthenticated users are redirected to `/jerald-portal/login`.
- Redirect authenticated users away from `/jerald-portal/login` to `/jerald-portal`.
