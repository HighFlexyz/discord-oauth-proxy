# Discord OAuth2 Vercel Proxy

This is a Vercel serverless function that acts as a proxy for your Discord bot's OAuth2 callback.

## Setup Instructions

### 1. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### 2. Set Environment Variable
After deployment, set your server URL:
```bash
vercel env add SERVER_URL
# Enter your current server URL: https://ban-examining-poster-fate.trycloudflare.com
```

### 3. Update Discord Application
1. Go to Discord Developer Portal
2. Update OAuth2 Redirect URI to: `https://your-project.vercel.app/oauth2/callback`

### 4. Update Bot Config
Update your bot's config.js:
```javascript
responseurl: "https://your-project.vercel.app/",
```

## How it works
- Vercel receives the OAuth2 callback
- Forwards the request to your actual server
- Returns the response back to Discord/user
- Provides HTTPS and custom domain for free

## Benefits
- ✅ Free HTTPS domain
- ✅ Custom subdomain (yourproject.vercel.app)
- ✅ No server management
- ✅ Automatic SSL certificates
- ✅ Global CDN
