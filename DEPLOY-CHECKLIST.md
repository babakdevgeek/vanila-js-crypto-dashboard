# Deployment Checklist for Cloudflare Pages

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

All should load without 404 errors. The client router should handle navigation.

## Files to Deploy

Deploy the entire project directory:

```
├── index.html          ✓ Required
├── index.js            ✓ Required
├── router.js           ✓ Required
├── reactive-cache.js   ✓ Required
├── functions/
│   └── _middleware.js  ✓ Required (SPA routing)
├── components/         ✓ Required
├── page-components/    ✓ Required
├── styles/             ✓ Required
├── constants/          ✓ Required
├── custom-functions/   ✓ Required
├── fetch-objects/      ✓ Required
└── public/             ✓ Optional
```

## Deploy to Cloudflare Pages

### Option 1: Git Integration (Recommended)
1. Push this repo to GitHub/GitLab/Bitbucket
2. Log into Cloudflare Dashboard → Pages
3. Click "Create a project" → Connect your Git provider
4. Select the repository
5. Build settings:
   - **Build command:** (leave empty)
   - **Build output directory:** `/` (root)
6. Click "Save and Deploy"

### Option 2: Direct Upload
1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
2. Log in:
   ```bash
   wrangler login
   ```
3. Deploy:
   ```bash
   wrangler pages deploy . --project-name=your-project-name
   ```

## Verify Deployment

After deploying, test these URLs in your browser:

- [ ] https://your-project.pages.dev/ (home)
- [ ] https://your-project.pages.dev/about
- [ ] https://your-project.pages.dev/coin/bitcoin
- [ ] https://your-project.pages.dev/chart

## What Should Happen

1. **Direct URL access works:** Visiting `/coin/bitcoin` directly loads the page
2. **Client routing works:** Clicking links navigates without page reload
3. **Browser back/forward works:** History navigation works correctly
4. **Static assets load:** CSS, JS, images all load correctly
5. **Refresh works:** Pressing F5 on any route reloads the page correctly

## Troubleshooting

### 404 on direct URL access
- Verify `functions/_middleware.js` exists in the root
- Check Cloudflare Pages logs for errors

### White screen or console errors
- Open browser DevTools → Console tab
- Check for JavaScript errors
- Verify all paths in imports are correct

### Static assets not loading
- Check the Network tab in DevTools
- Ensure file paths are relative (start with `./` or `/`)
