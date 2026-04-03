# PROSPER - Evidence-Based Parenting

This project is a React application built with Vite and Tailwind CSS. It is designed to be portable and can be deployed as a static site or a full-stack application.

## Deployment Options

### 1. Static Site (GitHub Pages, Netlify, Vercel)

The app is configured to work as a static site by default. It uses initial data from `src/data/articles.ts` and persists user interactions (comments, votes) in `localStorage`.

**Steps to deploy:**
1. Run `npm run build`.
2. Upload the contents of the `dist` folder to your static host.
3. **GitHub Pages Note**: If your site is not at the root (e.g., `https://user.github.io/repo/`), update `base` in `vite.config.ts` to `'/repo/'`.

### 2. Full-Stack (Cloud Run, Railway, Heroku)

The project includes an Express backend (`server.ts`) for persistence and admin features.

**Steps to deploy:**
1. Ensure `NODE_ENV` is set to `production`.
2. Run `npm install`.
3. Run `npm run build`.
4. Start the server with `npm start` (or `node server.ts` using a TS runner like `tsx`).

## Features
- **Dynamic Background**: Animated mesh gradient background.
- **Research Summaries**: Clear, evidence-based guidance for parents.
- **Interactive Features**: Comments, polls, and related articles.
- **Admin Dashboard**: Secure comment management (admin@prosper.org / admin123).
- **Share Feature**: Easily share articles via social media or link copying.

## Local Development
1. `npm install`
2. `npm run dev`
