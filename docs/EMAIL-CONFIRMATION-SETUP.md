# Email Confirmation Setup Guide

## Issue: Not Receiving Confirmation Emails

If you're not receiving confirmation emails after signup, follow these steps:

---

## Step 1: Check Supabase Email Settings

1. **Go to Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open Authentication Settings**
   - Click "Authentication" in the left sidebar
   - Click "Settings" at the bottom
   - Click "Auth" tab

3. **Enable Email Confirmations**
   - Scroll to "Email" section
   - Find "Enable email confirmations"
   - **Turn it ON** (toggle should be blue/green)
   - Click "Save" at the bottom

---

## Step 2: Configure Email Templates

1. **In Authentication → Email Templates**
   - Click "Confirm signup" template
   - Make sure the template is enabled
   - Check that the confirmation link is present: `{{ .ConfirmationURL }}`

2. **Default Template Should Look Like:**
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

---

## Step 3: Configure Redirect URLs

1. **In Authentication → URL Configuration**
   - Find "Site URL" - should be your app URL (e.g., `http://localhost:5173` for development)
   - Find "Redirect URLs" - add:
     - `http://localhost:5173/auth/callback`
     - `http://localhost:5173/access_token`
     - Your production URL + `/auth/callback` (if deployed)

2. **Example Configuration:**
   - Site URL: `http://localhost:5173`
   - Redirect URLs:
     ```
     http://localhost:5173/auth/callback
     http://localhost:5173/access_token
     https://yourdomain.com/auth/callback  (for production)
     ```

---

## Step 4: Check Email Provider Settings

### Option 1: Using Supabase Built-in Email (Development)
- Supabase provides built-in email for development
- Limited to a small number of emails per hour
- Should work out of the box

### Option 2: Using Custom SMTP (Production Recommended)
1. **Go to Project Settings → Auth**
2. Scroll to "SMTP Settings"
3. Enable "Enable Custom SMTP"
4. Configure your SMTP provider:
   - **Host**: (e.g., smtp.sendgrid.net, smtp.gmail.com)
   - **Port**: Usually 587 or 465
   - **Username**: Your SMTP username
   - **Password**: Your SMTP password
   - **Sender Email**: The "from" email address
   - **Sender Name**: Display name (e.g., "TCN Invite System")

---

## Step 5: Test Signup Flow

1. **Clear Browser Data**
   - Press F12 → Application tab
   - Clear "Local Storage" and "Session Storage"
   - Close developer tools

2. **Go to Signup Page**
   - Navigate to `/signup`
   - Open browser console (F12 → Console)

3. **Fill Out Signup Form**
   - Enter email, password, full name
   - Click "Create Account"

4. **Watch Console Logs**
   - Look for: `🔵 [2/5] Auth response: { hasUser: true, hasSession: false, hasError: false }`
   - If `hasSession: false`, email confirmation is required
   - You should see: `⚠️ Email confirmation required!`
   - A notification should appear saying "Check your email"

5. **Check Your Email**
   - Look in inbox for email from Supabase
   - Check spam/junk folder if not found
   - Click the confirmation link

6. **After Clicking Confirmation Link**
   - Should redirect to `/auth/callback`
   - Should see "Email verified successfully!"
   - Should auto-redirect to dashboard

---

## Troubleshooting

### Issue: "Email confirmation required" but no email received

**Possible causes:**
1. Email confirmations are disabled in Supabase
2. SMTP is not configured (for custom email)
3. Email is in spam folder
4. Wrong email address entered

**Solutions:**
- Double-check Supabase email settings (Step 1)
- Check spam/junk folder
- Try with a different email address
- Check Supabase logs for email delivery errors:
  - Dashboard → Logs → Filter by "auth"

### Issue: Email received but link doesn't work

**Possible causes:**
1. Redirect URLs not configured properly
2. Wrong Site URL in settings

**Solutions:**
- Check URL Configuration (Step 3)
- Make sure `/auth/callback` route exists in your app
- Check browser console for errors

### Issue: "Invalid or expired link"

**Possible causes:**
1. Link was already used
2. Link expired (default: 24 hours)
3. User was already confirmed

**Solutions:**
- Request a new confirmation email
- Check if user is already confirmed in Supabase Dashboard → Authentication → Users

---

## Development vs Production

### Development (localhost):
- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/auth/callback`
- Can use Supabase built-in email

### Production:
- Site URL: `https://yourdomain.com`
- Redirect URLs: `https://yourdomain.com/auth/callback`
- **Recommended**: Use custom SMTP (SendGrid, Mailgun, etc.)

---

## Console Logs to Check

When testing signup, you should see these logs in order:

```
📝 Submitting signup form...
🔵 [1/5] Starting signup process...
🔵 [2/5] Calling Supabase auth.signUp...
🔵 [2/5] Auth response: { hasUser: true, hasSession: false, hasError: false }
✓ [2/5] User created: <user-id>
✓ Metadata sent: { full_name: "...", role: "inviter" }
⚠️ Email confirmation required!
📝 Signup result: { hasData: true, hasError: false, requiresEmailConfirmation: true }
```

If `hasSession: true`, it means email confirmation is **disabled** and user is logged in immediately.

---

## Quick Fix: Disable Email Confirmation (Not Recommended for Production)

If you want to disable email confirmation for testing:

1. Go to Supabase Dashboard → Authentication → Settings → Auth
2. Find "Enable email confirmations"
3. Turn it **OFF**
4. Save

**Note:** This is not recommended for production as it allows anyone to create accounts without verifying their email.

---

## Need More Help?

1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Check network tab (F12 → Network) for failed requests
4. Share console logs for further debugging
