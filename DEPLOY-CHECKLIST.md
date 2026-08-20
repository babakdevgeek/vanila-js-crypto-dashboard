# Deployment Checklist for Cloudflare Workers

## Local Testing

Test the project locally before deploying:

```bash
node dev-server.js
```

Then open http://localhost:3000 and test these routes by typing them directly in the browser:

- [ ] http://localhost:3000/ (home)
- [ ] http://localhost:3000/about
- [ ] http://localhost:3000/coin/bitcoin
- [ ] http://localhost:3000/chart
- [ ] http://localhost:3000/chart/bitcoin

All should load without 404 errors. The client router should handle navigation.

## Files to Deploy

```
├── src/
│   └── index.js          Required (Worker entry point)
├── wrangler.toml         Required (Workers config)
├── index.html            Required
├── index.js              Required (app entry point)
├── router.js             Required
├── reactive-cache.js     Required
├── components/           Required
├── page-components/      Required
├── styles/               Required
├── constants/            Required
├── custom-functions/     Required
├── fetch-objects/        Required
└── public/               Optional
```

## Deploy to Cloudflare Workers

### Prerequisites
1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
2. Log in:
   ```bash
   wrangler login
   ```

### First-time setup
```bash
wrangler deploy
```
This creates the Worker and returns your live URL (e.g. `crypto-dashboard.<your-subdomain>.workers.dev`).

### Subsequent deploys
```bash
wrangler deploy
```

The Worker serves static assets via the `[assets]` binding and falls back to `index.html` for SPA routing.

## How It Works

1. A request comes in (e.g. `/coin/bitcoin`)
2. The Worker tries to serve a matching static file via `env.ASSETS.fetch()`
3. If the file exists (JS, CSS, etc.), it's served directly
4. If not found, the Worker serves `index.html` so the client-side router can handle the route

## Verify Deployment

After deploying, test these URLs in your browser:

- [ ] https://crypto-dashboard.<subdomain>.workers.dev/ (home)
- [ ] https://crypto-dashboard.<subdomain>.workers.dev/about
- [ ] https://crypto-dashboard.<subdomain>.workers.dev/coin/bitcoin
- [ ] https://crypto-dashboard.<subdomain>.workers.dev/chart
- [ ] https://crypto-dashboard.<subdomain>.workers.dev/chart/bitcoin

## What Should Happen

1. **Direct URL access works:** Visiting `/coin/bitcoin` directly loads the page (not 404)
2. **Refresh works:** Pressing F5 on any route reloads the page correctly
3. **Client routing works:** Clicking links navigates without page reload
4. **Browser back/forward works:** History navigation works correctly
5. **Static assets load:** CSS, JS, images all load correctly

## Troubleshooting

### 404 on direct URL access
- Verify `src/index.js` exists with the SPA fallback logic
- Check `wrangler.toml` has `[assets] directory = "."`
- Run `wrangler tail` to see Worker logs

### White screen or console errors
- Open browser DevTools -> Console tab
- Check for JavaScript errors
- Verify all paths in imports are correct

### Static assets not loading
- Check the Network tab in DevTools
- Ensure file paths are relative (start with `./` or `/`)
- Verify `directory = "."` in wrangler.toml points to the correct directory
