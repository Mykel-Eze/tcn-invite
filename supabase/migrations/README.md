# Supabase migrations

SQL files for the TCN Invite database, in the order they were (or should be) applied to the Supabase project. Files `001`–`007` are the historical scripts that have already been run against the live database; they are kept here for reference.

| File | Purpose | Status |
|---|---|---|
| `001_initial_schema.sql` | Tables (profiles, campuses, invitations), base RLS, sample seed | applied |
| `002_profiles_invitations_rls_update.sql` | Early RLS additions | applied |
| `003_fix_rls_complete.sql` | RLS rebuild for profiles + invitations | applied |
| `004_profile_creation_trigger.sql` | `handle_new_user` trigger auto-creating profiles | applied |
| `005_seed_tcn_centers.sql` | Seed all TCN campuses | applied |
| `006_campuses_is_active.sql` | `is_active` column on campuses | applied |
| `007_campuses_rls.sql` | Campus RLS policies | applied |
| `008_security_fixes.sql` | **Security fixes — must be run** (see below) | ⚠️ **pending** |

## ⚠️ Action required: run `008_security_fixes.sql`

Open the Supabase Dashboard → SQL Editor, paste the contents of `008_security_fixes.sql`, and run it. It is idempotent (safe to run twice). It fixes:

1. **Signup role escalation** — the old trigger trusted a client-supplied `role` in signup metadata, so anyone could create an admin account with a direct API call.
2. **Self-service role escalation** — any logged-in user could update their own `role` to `admin` through the REST API.
3. **Public member data** — every member's name, email, and role was readable by anyone holding the public anon key.
4. Adds the `guest_email` / `service_time` columns on invitations and `is_active` on campuses if they are missing.

Also recommended (Supabase Dashboard, not SQL): **Authentication → Providers → Email → Minimum password length → 8**, to match the new client-side validation.
