# Balfour Beatty News

Simple news reader using Hacker News (Algolia API). Built with React + Vite (no JSX). All components use `React.createElement()`.

Prereqs:
- Node 16+ and npm

Install and run:

1. Initialize project (recommended way):

```bash
npx create-vite@latest balfour-beatty-news -- --template vanilla
cd balfour-beatty-news
# Replace the generated src/main.js with the project's `src/main.js` and copy other files in this repo into the folder
npm install
cp .env.example .env
npm run dev
```

Or if you placed these files into your workspace already, run:

```bash
npm install
cp .env.example .env
npm run dev
```

Environment:
- Edit `.env` (copy from `.env.example`) to change `VITE_API_BASE_URL`.

API & limitations:
- Uses Algolia Hacker News API at `https://hn.algolia.com/api/v1`.
- No API key required.
- The API does not support arbitrary server-side filters — the Filters Drawer is UI-only and disabled via tooltip.

Editing default search term:
- The app defaults to searching "news" when the search input is empty. Change the default inside `src/features/news/NewsList.js` in the `newsService.search(query || 'news', page)` call.

Scripts:
- `npm run dev` — start dev server
- `npm run build` — build
- `npm run preview` — preview build
- `npm run lint` — lint with ESLint
- `npm run format` — format with Prettier
