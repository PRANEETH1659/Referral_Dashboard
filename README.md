# Go Business Referral Dashboard

React + Vite app for the Go Business referral dashboard assessment.

## Setup

```bash
npm install
npm run dev
```

Local URL:

```bash
http://127.0.0.1:3000
```

## Test Credentials

- Email: `admin@example.com`
- Password: `admin123`

## Features

- Login with JWT cookie storage
- Protected routes
- Dashboard metrics, service summary, referral link and code
- Search and sort using the live API
- Client-side pagination with 10 rows per page
- Referral detail page
- Public 404 page
- Responsive layout

## Build

```bash
npm run build
```

## GitHub Push

```bash
git add .
git commit -m "Complete referral dashboard assessment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Vercel Deploy

1. Push the repo to GitHub.
2. Sign in to Vercel.
3. Click `Add New` -> `Project`.
4. Import the GitHub repo.
5. Vercel should auto-detect `Vite`.
6. Click `Deploy`.

Build settings if Vercel asks:

- Build Command: `npm run build`
- Output Directory: `dist`

## Submission Pack

Submit:

- Public GitHub repository link
- Live Vercel deployment URL

If they ask for a zip instead:

1. Keep the project folder as is.
2. Delete `node_modules` if you want a smaller zip.
3. Compress the project folder.
4. Make sure the zip contains `README.md`.
