# Oracle Frontend (Vercel)

Static HTML/CSS/JS for **The Oracle's First Trial**.

The browser only talks to this domain. `vercel.json` proxies `/api/*`
server-side to the Render backend, so there is no CORS setup and no
answers/flag in the page source.

## Configure the backend URL

Replace the placeholder host in `vercel.json` with your Render URL:

```json
{
  "source": "/api/:path*",
  "destination": "https://YOUR-ORACLE1-BACKEND.onrender.com/api/:path*"
}
```

## Deploy on Vercel

1. Import this folder (Framework preset: **Other**, no build step).
2. Deploy. Pages: `/`, `/level2`, `/level3`, `/level4`.
3. `vercel.json` also maps the legacy `.php` URLs to the `.html` pages.
