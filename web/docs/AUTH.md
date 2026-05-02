# Auth — Google OAuth via Auth.js v5

Hackathon-grade login. Google OAuth provider only, JWT sessions, no
database adapter. Admin gating is a comma-separated allowlist
(`ADMIN_EMAILS`). When persistence ships (Postgres), swap in an
adapter and the rest of the wiring stays.

## Files

| File | Purpose |
|---|---|
| `src/lib/auth/config.ts` | `NextAuth({...})` + exported `auth`, `signIn`, `signOut`, `handlers` |
| `src/lib/auth/types.d.ts` | session augmentation (`isAdmin` on `session.user`) |
| `src/app/api/auth/[...nextauth]/route.ts` | catch-all OAuth route |
| `src/app/auth/signin/page.tsx` | brutalist sign-in screen |
| `src/components/system/session-provider.tsx` | client wrapper around `<SessionProvider>` |
| `src/components/system/user-menu.tsx` | top-right pill (signed in / guest / out) |
| `src/app/admin/layout.tsx` | server-side admin gate (redirects non-admins) |
| `src/lib/user/local-runs.ts` | localStorage cache for run history |

## Google Cloud Console — register the OAuth client

1. Go to <https://console.cloud.google.com/>.
2. Create a project (or pick an existing one).
3. **APIs & Services → OAuth consent screen**. Choose **External**.
   - App name: `30u30 Simulator`
   - User support email: yours
   - Developer contact info: yours
   - Scopes: `email`, `profile`, `openid` are enough.
   - Test users: add any Gmail accounts you want to test sign-in
     while the app is in "Testing" status. (You can publish later.)
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**.
   - Name: `30u30 — web`.
   - **Authorized redirect URIs** (add both):
     - `http://localhost:3001/api/auth/callback/google`
     - `https://30u30.fail/api/auth/callback/google`
5. Copy the generated **Client ID** and **Client Secret** into
   `.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

If you change the dev port (default `3001`), update the localhost URI
to match — Google's redirect check is exact-match.

## Env vars

```
NEXTAUTH_SECRET=         # openssl rand -base64 32
NEXTAUTH_URL=            # http://localhost:3001  (dev)
                         # https://30u30.fail     (prod)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=            # kevin@example.com,admin@example.com
```

Generate the secret:

```bash
openssl rand -base64 32
```

`ADMIN_EMAILS` is a comma-separated, case-insensitive allowlist. The
allowlist is evaluated in the JWT callback (`lib/auth/config.ts`) and
the result is baked into the JWT as `token.isAdmin`. Flipping someone's
admin bit therefore requires them to sign out and sign back in.

If any of the OAuth env vars are missing the app still renders fine —
visitors just stay signed out and `/admin/usage` redirects them away.

## Test sign-in locally

```bash
cd web
cp .env.local.example .env.local   # then fill in the OAuth blanks
npm install
npm run dev                        # http://localhost:3001
```

Visit `http://localhost:3001/auth/signin` and click "CONTINUE WITH
GOOGLE". You should round-trip through `accounts.google.com` and land
back on `/` with a `UserMenu` showing your name.

To exercise the admin gate:

1. Add your email to `ADMIN_EMAILS=...` in `.env.local`.
2. Restart `npm run dev` (env reads on boot).
3. Sign in. Visit `/admin/usage`. You should see the dashboard with
   a 🔒 ADMIN · `<your-email>` strip rendered server-side at the top
   of the page.

To verify the redirect path: remove yourself from `ADMIN_EMAILS`,
sign out, sign back in, and try `/admin/usage` — you should land on
`/auth/signin?reason=admin_required`.

## How the JWT session works

`session: { strategy: "jwt" }` means there's no DB adapter. Auth.js
issues a signed JWT in a cookie (`authjs.session-token`) on
sign-in. Every request that calls `auth()` decodes the cookie locally,
so admin gating doesn't hit a database.

Contents (after the `jwt`/`session` callbacks run):

```ts
session.user = {
  email: string,
  name: string,
  image: string,    // google profile pic url (lh3.googleusercontent.com)
  isAdmin: boolean, // computed from ADMIN_EMAILS at first sign-in
}
```

`isAdmin` is set once when the JWT is minted; subsequent requests
just read it. To revoke admin status mid-session, add a sign-out
button to `/admin/usage` (or wait for the JWT to expire, default
30 days).

## Run-id history (the local fallback)

`web/src/lib/api/client.ts → createRun()` accepts an optional
`userId` parameter and:

1. POSTs the request body with `user_id` attached (the backend
   currently ignores this field — see TODO below).
2. On success, calls `rememberRun(userId, run_id)` which pushes the
   id into `localStorage["aces:user:{user_id}:runs"]` (or the synthetic
   guest id for unauthenticated visitors).

`/me/runs` will eventually hydrate from `listRuns(...)` and merge with
the backend response. For now it renders mock archive data.

## Postgres swap (TODO)

When the user table lands:

- Add `@auth/drizzle-adapter` (or whichever ORM we ship with) and
  pass it to `NextAuth({ adapter, ... })`.
- Switch `session: { strategy: "jwt" }` → `"database"` if we want
  server-side session revocation. JWT is fine until then.
- Backend `routes.py /run/create` should persist `user_id` to a
  `runs.user_id` column (the wire field is already arriving).
- `/me/runs` swaps mock for `GET /me/runs?user_id={email}`.

## Voice notes

All auth-screen copy is intentionally deadpan. No "Welcome back!", no
"Successfully signed in!". The brand voice is cocky-twitter-poisoned
deadpan; if you find yourself reaching for a 🎉 you've drifted.
