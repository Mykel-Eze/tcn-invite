# RLS Error Fix Guide

## Problem
Getting error: `new row violates row-level security policy for table "profiles"`

## Root Cause
When a user signs up, the RLS (Row Level Security) policy on the `profiles` table is blocking the profile insert because the policy isn't configured correctly or there are conflicting policies.

---

## ✅ RECOMMENDED SOLUTION: Database Trigger (Best Practice)

This is the **production-ready** approach that major apps use.

### How it works:
- Supabase automatically creates a profile when a user signs up
- No manual insert from client side
- Zero RLS issues
- More secure

### Steps:

**1. Run this SQL in Supabase SQL Editor:**

Open your Supabase project → SQL Editor → New Query → Paste [fix-with-trigger.sql](fix-with-trigger.sql) → Run

**2. That's it!**

The trigger will automatically create profiles for new signups. Your current code already supports this (it has the metadata in the signup call).

### Test it:
1. Try signing up a new user
2. Check the `profiles` table - profile should be created automatically
3. No more RLS errors!

---

## Alternative Solution: Manual Insert with Fixed RLS Policies

If you prefer NOT to use triggers, use this approach:

### Steps:

**1. Run this SQL in Supabase SQL Editor:**

Open your Supabase project → SQL Editor → New Query → Paste [fix-rls-complete.sql](fix-rls-complete.sql) → Run

**2. The code is already updated** in [AuthContext.jsx](src/contexts/AuthContext.jsx) with:
- Better error handling
- 500ms wait for auth session to establish
- Detailed console logging

### Test it:
1. Open browser console (F12)
2. Try signing up
3. Check console logs to see where it fails
4. Profile should be created successfully

---

## Troubleshooting

### Still getting errors after running SQL?

**Check 1: Verify policies exist**
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
```

Should show:
- Public profiles are viewable by everyone.
- Users can insert their own profile. (OR the trigger approach doesn't need this)
- Users can update own profile.
- Admins can update any profile.

**Check 2: Check if email confirmation is enabled**
- Go to Supabase Dashboard → Authentication → Settings
- If "Enable email confirmations" is ON, users need to verify email first
- For testing, turn this OFF temporarily

**Check 3: Check RLS is enabled**
```sql
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
```

Should show `rowsecurity = true`

**Check 4: Try with anon key**
- Make sure `.env.local` has the correct `VITE_SUPABASE_ANON_KEY`
- Not the service role key (that bypasses RLS)

---

## Which Solution Should I Use?

### Use **Database Trigger** if:
✅ You want production-ready code
✅ You want to avoid RLS issues completely
✅ You may add more user fields in the future
✅ You want better security (server-side creation)

### Use **Manual Insert** if:
⚠️ You need more control over profile creation
⚠️ You want to conditionally create profiles
⚠️ You have complex signup logic

**Recommendation: Use the Database Trigger approach!**

---

## Summary of Files Created

1. **[fix-with-trigger.sql](fix-with-trigger.sql)** - RECOMMENDED: Auto-create profiles with trigger
2. **[fix-rls-complete.sql](fix-rls-complete.sql)** - Alternative: Manual insert with fixed policies
3. **[supabase_schema_update.sql](supabase_schema_update.sql)** - Original attempt (superseded by above)

---

## After Fixing

Once signup works, test these flows:

1. **Member signup** → Should create user with role `'inviter'`
2. **Create invitation** → Should save with inviter_id
3. **Manual role change in Supabase** → Change a user's role to `'admin'`
4. **Admin features** → Access `/admin` dashboard, manage users
5. **PCU Host** → Change role to `'pcu_host'`, access `/pcu-checkin`

---

## Need More Help?

If still not working:
1. Check browser console for detailed error logs
2. Check Supabase logs: Dashboard → Logs → Database
3. Share the exact error message including the full stack trace
