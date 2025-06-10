# OAuth Setup Guide for Voxa

This guide explains how to configure Google and GitHub OAuth authentication for the Voxa application.

## Overview

The Voxa application now supports social authentication through:
- **Google OAuth** - Sign in with Google accounts
- **GitHub OAuth** - Sign in with GitHub accounts
- **Email/Password** - Traditional email authentication (existing)

## Supabase OAuth Configuration

### 1. Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Voxa project
3. Navigate to **Authentication** > **Providers**

### 2. Configure Google OAuth

#### Step 1: Create Google OAuth App
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   - `https://dqsudzwhxlpqqxhrvzkq.supabase.co/auth/v1/callback`
   - `http://localhost:3002/auth/callback` (for development)

#### Step 2: Configure in Supabase
1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click **Enable**
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Save the configuration

### 3. Configure GitHub OAuth

#### Step 1: Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the application details:
   - **Application name**: Voxa
   - **Homepage URL**: `http://localhost:3002` (or your production URL)
   - **Authorization callback URL**: `https://dqsudzwhxlpqqxhrvzkq.supabase.co/auth/v1/callback`
4. Register the application
5. Note down the **Client ID** and generate a **Client Secret**

#### Step 2: Configure in Supabase
1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Find **GitHub** and click **Enable**
3. Enter your GitHub OAuth credentials:
   - **Client ID**: From GitHub OAuth App
   - **Client Secret**: From GitHub OAuth App
4. Save the configuration

## Implementation Details

### Frontend Changes

The auth form now includes:
- **Social Auth Buttons**: Google and GitHub sign-in buttons above the email form
- **Visual Divider**: "Or continue with email" separator
- **Voxa Design System**: Purple (#A855F7) and pink (#EC4899) color scheme
- **Loading States**: Individual loading indicators for each OAuth provider
- **Error Handling**: Proper error messages for OAuth failures

### Backend Changes

- **OAuth Callback Route**: `/auth/callback/route.ts` handles OAuth redirects
- **Session Management**: Automatic session creation after successful OAuth
- **Error Handling**: Graceful error handling with redirects to auth page

### Security Features

- **Redirect Validation**: Only allows redirects to authorized URLs
- **Error Logging**: Server-side error logging for debugging
- **Session Security**: Secure session handling through Supabase

## Testing OAuth Integration

### Development Testing
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3002/auth`
3. Click on "Continue with Google" or "Continue with GitHub"
4. Complete the OAuth flow
5. Verify redirect to `/interview` page

### Production Setup
1. Update OAuth app redirect URLs to production domain
2. Update `NEXT_PUBLIC_APP_URL` in environment variables
3. Test OAuth flow in production environment

## Troubleshooting

### Common Issues

1. **OAuth Error**: Check that redirect URLs match exactly in OAuth provider settings
2. **Callback Errors**: Verify Supabase project URL and callback route implementation
3. **Session Issues**: Check Supabase auth configuration and session handling

### Debug Steps

1. Check browser developer tools for network errors
2. Review Supabase auth logs in dashboard
3. Verify OAuth provider configuration
4. Test with different browsers/incognito mode

## Environment Variables

The following environment variables are used:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

OAuth credentials are configured directly in Supabase Dashboard, not in environment variables.

## User Experience

- **Seamless Integration**: OAuth buttons blend with existing design
- **Fast Authentication**: One-click sign-in with social accounts
- **Fallback Option**: Email/password authentication remains available
- **Responsive Design**: Works on all device sizes
- **Loading Feedback**: Clear visual feedback during authentication

## Next Steps

1. Configure OAuth providers in Supabase Dashboard
2. Test authentication flow
3. Monitor user adoption of social authentication
4. Consider adding additional providers (LinkedIn, Microsoft, etc.)
