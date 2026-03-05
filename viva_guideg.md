# 📰 Balfour Beatty News — Complete Viva Guide (Updated)

> Every file · Every hook · Every state · Every function · Every "why"

---

## 1. Application Overview

A **React 18 SPA** (Single Page Application) that:
- Fetches live tech news from **Hacker News Algolia API** (free, no key needed)
- Supports **search**, **quick-tag filtering**, and **sort order**
- Has **dark / light theme toggle**
- Has **two pages** — Home (news list) and Article Detail
- Uses **infinite scroll** — loads next page automatically as you scroll

**No backend. No database. Pure frontend.**

---

## 2. Final Folder Structure

```
news/
├── index.html              ← Only HTML file (SPA shell)
├── vite.config.js          ← Build tool + JSX-in-.js plugin
├── package.json            ← Dependencies and npm scripts
├── .eslintrc.cjs           ← ESLint rules (prop-types: OFF)
└── src/
    ├── main.js             ← Entry point — mounts React into HTML
    ├── App.js              ← ONLY theme + Routes (minimal)
    ├── theme.js            ← MUI theme factory
    ├── styles.css          ← Global CSS reset
    ├── pages/
    │   ├── Home.js         ← Page 1 — owns all search/sort/filter state
    │   └── ArticleDetails.js ← Page 2 — owns article fetch state
    ├── components/
    │   ├── AppBarSearch.js ← Top search bar (debounced)
    │   ├── FiltersDrawer.js← Sort sidebar drawer
    │   ├── ThemeToggle.js  ← Dark/light icon button
    │   └── ArticleCard.js  ← Single news card UI
    ├── features/news/
    │   └── NewsList.js     ← Pagination + infinite scroll + fetch
    ├── services/
    │   └── newsService.js  ← ALL API calls
    └── utils/
        └── date.js         ← Pure date formatter
```

**Architecture rule:** `components → pages → App.js`
- **components/** = small reusable UI, no page-level state
- **pages/** = full layout with their own state
- **App.js** = only theme + route map

---

## 3. Tech Stack — Every Choice Explained

| Technology | Role | Why chosen |
|---|---|---|
| **React 18** | UI library | Component model, reactive re-renders |
| **Vite** | Dev server & bundler | 10× faster than Webpack/CRA, instant HMR |
| **MUI v5** | Component library | Material Design — theme system, cards, drawers built-in |
| **@emotion/react/styled** | CSS-in-JS engine | Required by MUI internally |
| **react-router-dom v6** | Client-side routing | Industry standard for React SPAs |
| **Hacker News Algolia API** | Data source | Free, no API key, real news, supports pagination |
| **ESLint** | Linting | Catches bugs before runtime |
| **Prettier** | Formatter | Auto-formats code on save |

---

## 4. JavaScript Fundamentals Used

### `const` vs `let`
```js
const pageSize = 12       // Cannot be reassigned — EVER
let isActive = true       // Can change: isActive = false
```
Use `const` always. Use `let` only when you MUST reassign. Never `var`.

### Arrow Function vs `function`
```js
function handleOpenFilters() { setFiltersOpen(true) }  // named function
const fn = () => { setFiltersOpen(true) }              // arrow function
onClick={() => setFiltersOpen(true)}                   // inline arrow
```
Both work the same way in React. Arrow functions are shorter for inline callbacks.

### Destructuring
```js
const [mode, setMode] = useState('light')   // array destructuring
const { id } = useParams()                  // object destructuring
```

### Template Literals
```js
const url = `/article/${article.id}`   // backtick + ${}
```

### Ternary Operator
```js
const endpoint = sortBy === 'relevance' ? '/search' : '/search_by_date'
// condition ? valueIfTrue : valueIfFalse
```

### `||` Default Fallback
```js
const mode = props.mode || 'light'
// if props.mode is undefined/null/'' → use 'light'
```

---

## 5. All React Hooks — Deep Explanation

### `useState` — Store Data, Trigger Re-renders

**What it does:** Stores a value inside a component. When you call the setter, React re-renders the component with the new value.

```js
const [value, setValue] = useState(initialValue)
//     ↑ read  ↑ write    ↑ hook    ↑ start value
```

**Every state variable in the whole app:**

| File | Variable | Initial | Purpose |
|---|---|---|---|
| [App.js](file:///d:/BB/news/src/App.js) | `mode` | `'light'` | Theme mode — 'light' or 'dark' |
| [pages/Home.js](file:///d:/BB/news/src/pages/Home.js) | `searchTerm` | `''` | The current search query |
| [pages/Home.js](file:///d:/BB/news/src/pages/Home.js) | `filtersOpen` | `false` | Whether sort drawer is open |
| [pages/Home.js](file:///d:/BB/news/src/pages/Home.js) | `sortBy` | `'latest'` | Selected sort order |
| [pages/ArticleDetails.js](file:///d:/BB/news/src/pages/ArticleDetails.js) | `article` | `location.state or null` | Article data to display |
| [pages/ArticleDetails.js](file:///d:/BB/news/src/pages/ArticleDetails.js) | `loading` | `false` | API call in progress? |
| [pages/ArticleDetails.js](file:///d:/BB/news/src/pages/ArticleDetails.js) | `error` | `''` | Error message string |
| [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) | `page` | `0` | Current API page number |
| [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) | `items` | `[]` | Accumulated articles list |
| [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) | `loading` | `false` | Fetch in progress? |
| [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) | `error` | `''` | Error message |
| [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) | `hasMore` | `true` | More pages available? |
| [AppBarSearch.js](file:///d:/BB/news/src/components/AppBarSearch.js) | `value` | `''` | Input display text |

**Functional updater form — when to use it:**
```js
// RISKY — reads possibly stale snapshot of `mode`
setMode(mode === 'light' ? 'dark' : 'light')

// SAFE — gets guaranteed latest value as argument
setMode(function(current) {
  return current === 'light' ? 'dark' : 'light'
})
```
Use the function form whenever new state depends on old state.

---

### `useEffect` — Run Code After Render (Side Effects)

**What it does:** Runs code AFTER React finishes rendering. Used for: API calls, timers, event listeners.

```js
useEffect(() => {
  // runs after render

  return () => {
    // cleanup — runs before next effect OR on unmount
  }
}, [dep1, dep2])   // re-run when dep1 or dep2 changes
```

#### Effect 1 in [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) — Reset list when query/sort changes
```js
React.useEffect(() => {
  setItems([])       // wipe old articles
  setPage(0)         // back to page one
  setHasMore(true)   // assume more pages exist
}, [query, sortBy])
```
- Runs when `query` or `sortBy` changes
- Prevents old search results mixing with new ones

#### Effect 2 in [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) — Fetch articles
```js
React.useEffect(() => {
  let isActive = true   // ← prevents setState after unmount

  async function loadNews() {
    setLoading(true)
    setError('')

    try {
      const result = await newsService.search(query || 'news', page, { sortBy })

      if (!isActive) return         // component unmounted — stop!

      setItems(function(prev) {
        const merged = page === 0   // page 0 = replace, page 1+ = append
          ? result.items
          : prev.concat(result.items)
        return sortItems(uniqueById(merged), sortBy)
      })
      setHasMore(result.hasMore)

    } catch (err) {
      if (!isActive) return
      setError(err.message || 'Failed to load news')
    } finally {
      if (isActive) setLoading(false)  // ALWAYS runs, even if try or catch throws
    }
  }

  loadNews()
  return () => { isActive = false }   // cleanup
}, [query, page, sortBy])
```
- `isActive` flag — if the component unmounts while fetch is running, we don't call setState on a dead component
- [try](file:///d:/BB/news/src/features/news/NewsList.js#109-115) = attempt this; `catch` = if error, handle it; `finally` = runs regardless (perfect for setLoading)
- Cannot make useEffect itself `async` because useEffect must return a cleanup function, not a Promise

#### Effect 3 in [NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js) — Infinite Scroll
```js
React.useEffect(() => {
  const currentTarget = loadMoreRef.current     // invisible div at page bottom
  if (!currentTarget) return

  const observer = new IntersectionObserver(
    entries => {
      const firstEntry = entries[0]
      if (firstEntry && firstEntry.isIntersecting && hasMore && !loading) {
        setPage(p => p + 1)    // increment page → triggers Effect 2
      }
    },
    { rootMargin: '500px 0px' }   // fire 500px BEFORE element reaches viewport
  )

  observer.observe(currentTarget)
  return () => { observer.disconnect() }
}, [hasMore, loading])
```
- `IntersectionObserver` — browser API that fires a callback when an element enters/exits the viewport
- The sentinel `<Box ref={loadMoreRef} sx={{ height: 20 }} />` is the watched element — invisible, at the very bottom
- `rootMargin: '500px'` — load next page before the user physically reaches the bottom = seamless UX

#### Effect in [ArticleDetails.js](file:///d:/BB/news/src/pages/ArticleDetails.js) — Fetch single article
```js
React.useEffect(() => {
  if (!id) return

  let isActive = true

  async function loadArticle() {
    setLoading(true)
    setError('')
    try {
      const data = await newsService.getItem(id)
      if (isActive) setArticle(data)
    } catch (err) {
      if (!isActive) return
      setError('Failed to fetch details from API')
      if (!location.state) setArticle(null)  // no fallback data → show nothing
    } finally {
      if (isActive) setLoading(false)
    }
  }

  loadArticle()
  return () => { isActive = false }
}, [id, location.state])
```
**Two-source strategy:**
1. `useState(location.state)` — article from card click, shown INSTANTLY (no loading)
2. useEffect API call — runs anyway to get fresh/complete data from server

#### Effect in [AppBarSearch.js](file:///d:/BB/news/src/components/AppBarSearch.js) — Cleanup debounce timer
```js
React.useEffect(() => {
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }
}, [])   // [] = runs once on mount, cleanup on unmount
```
If the component is removed while a 350ms timer is pending, this cancels it.

---

### `useMemo` — Cache Expensive Values

```js
// App.js
const theme = useMemo(() => getTheme(mode), [mode])
```
- [getTheme()](file:///d:/BB/news/src/theme.js#3-10) builds a large MUI theme object — expensive to compute
- `useMemo` caches the result and only recomputes when `mode` changes
- Without it: runs on every App re-render (very wasteful)

---

### `useRef` — Mutable Box, No Re-renders

Changing `ref.current` does NOT cause a re-render. Two uses:

**1. Storing a timer ID ([AppBarSearch.js](file:///d:/BB/news/src/components/AppBarSearch.js))**
```js
const timeoutRef = React.useRef(null)
timeoutRef.current = setTimeout(() => { onSearch(val) }, 350)
clearTimeout(timeoutRef.current)   // cancel on next keystroke
```
If this was state, each update would re-render and break the debounce.

**2. Referencing a real DOM element ([NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js))**
```js
const loadMoreRef = React.useRef(null)
<Box ref={loadMoreRef} sx={{ height: 20 }} />
// Then:
const currentTarget = loadMoreRef.current  // actual DOM node
observer.observe(currentTarget)
```
`ref` is React's escape hatch to raw DOM — lets you use browser APIs that need real elements.

---

### `useNavigate` — Change Page Programmatically

```js
const navigate = useNavigate()
navigate(`/article/${article.id}`, { state: article })
// Goes to /article/ID and passes article object in memory (not in URL)
```

### `useParams` — Read `:wildcard` from URL

```js
// Route: <Route path='/article/:id' element={<ArticleDetails />} />
const { id } = useParams()
// URL /article/38000000 → id = '38000000'
```

### `useLocation` — Read Current URL + Navigation State

```js
const location = useLocation()
// location.pathname = '/article/38000000'
// location.state    = article object passed by navigate()
```

---

## 6. All Functions Explained

### [App.js](file:///d:/BB/news/src/App.js)
| Function | Parameters | What it does |
|---|---|---|
| [handleToggleMode](file:///d:/BB/news/src/App.js#12-17) | none | Flips `mode` between 'light' and 'dark' using functional updater |

### [pages/Home.js](file:///d:/BB/news/src/pages/Home.js)
| Function | Parameters | What it does |
|---|---|---|
| [handleOpenFilters](file:///d:/BB/news/src/pages/Home.js#23-26) | none | Sets `filtersOpen = true` |
| [handleCloseFilters](file:///d:/BB/news/src/components/AppLayout.js#20-23) | none | Sets `filtersOpen = false` |

### [pages/ArticleDetails.js](file:///d:/BB/news/src/pages/ArticleDetails.js)
| Function | Parameters | What it does |
|---|---|---|
| [loadArticle](file:///d:/BB/news/src/routes/ArticleDetails.js#20-39) (async, inside useEffect) | none | Fetches full article by `id` from API |

### [components/AppBarSearch.js](file:///d:/BB/news/src/components/AppBarSearch.js)
| Function | Parameters | What it does |
|---|---|---|
| [handleChange](file:///d:/BB/news/src/components/AppBarSearch.js#12-22) | `e` (Event) | Updates input display; debounces `onSearch` call by 350ms |

### [components/FiltersDrawer.js](file:///d:/BB/news/src/components/FiltersDrawer.js)
| Function | Parameters | What it does |
|---|---|---|
| [handleSortChange](file:///d:/BB/news/src/components/FiltersDrawer.js#21-24) | `event` | Reads `event.target.value` (radio selection) → calls `onChangeSortBy` |
| [resetFilters](file:///d:/BB/news/src/components/FiltersDrawer.js#25-28) | none | Resets sort to `'latest'` |

### [components/ArticleCard.js](file:///d:/BB/news/src/components/ArticleCard.js)
| Function | Parameters | What it does |
|---|---|---|
| [openDetails](file:///d:/BB/news/src/components/ArticleCard.js#12-15) | none | Navigates to `/article/:id`, passes article as state |
| [handleKeyDown](file:///d:/BB/news/src/components/ArticleCard.js#16-22) | `event` | Opens article on Enter/Space keypress (keyboard accessibility) |
| [handleReadOriginalClick](file:///d:/BB/news/src/components/ArticleCard.js#23-26) | `event` | Calls `stopPropagation()` so button click doesn't bubble to card click |

### [features/news/NewsList.js](file:///d:/BB/news/src/features/news/NewsList.js)
| Function | Parameters | What it does |
|---|---|---|
| [sortItems](file:///d:/BB/news/src/features/news/NewsList.js#8-26) | `list`, `sortMode` | Sorts articles by date. Copies list first (`.slice()`), never mutates |
| [uniqueById](file:///d:/BB/news/src/features/news/NewsList.js#27-35) | `list` | Removes duplicate articles using a `Map` keyed by article id |
| [loadNews](file:///d:/BB/news/src/features/news/NewsList.js#55-78) (async, inside useEffect) | none | Fetches articles, merges with existing, deduplicates, sorts |
| [retry](file:///d:/BB/news/src/features/news/NewsList.js#109-115) | none | Resets all state → triggers a fresh fetch |

### [services/newsService.js](file:///d:/BB/news/src/services/newsService.js)
| Function | Parameters | What it does |
|---|---|---|
| [buildUrl](file:///d:/BB/news/src/services/newsService.js#15-28) | `path`, `params={}` | Builds a full URL from base + path + query params |
| [fetchJson](file:///d:/BB/news/src/services/newsService.js#29-38) | `path`, `params` | Calls [buildUrl](file:///d:/BB/news/src/services/newsService.js#15-28), fetches, checks status, returns JSON |
| [decodeHtmlEntities](file:///d:/BB/news/src/services/newsService.js#39-49) | `text` | Converts `&amp;` → `&`, `&lt;` → `<`, etc. |
| [cleanText](file:///d:/BB/news/src/services/newsService.js#50-64) | `value` | Strips HTML tags, normalises whitespace, decodes entities |
| [getTagFromText](file:///d:/BB/news/src/services/newsService.js#65-78) | `title`, `description`, `sourceTags` | Keyword-matches text to assign a category tag |
| [getTagThumbnail](file:///d:/BB/news/src/services/newsService.js#79-98) | `tag` | Generates an SVG gradient image as a data URI |
| [mapHitToArticle](file:///d:/BB/news/src/services/newsService.js#99-116) | `hit` | Normalises Algolia search result → standard article shape |
| [mapItemToArticle](file:///d:/BB/news/src/services/newsService.js#117-134) | `item` | Normalises single item API result → standard article shape |
| `newsService.search` | `query`, `page`, `options` | Fetches news list from Algolia API |
| `newsService.getItem` | `id` | Fetches single article by ID |

### [utils/date.js](file:///d:/BB/news/src/utils/date.js)
| Function | Parameters | What it does |
|---|---|---|
| [formatDate](file:///d:/BB/news/src/utils/date.js#1-13) | `iso` | Converts ISO date string → "Jan 5, 2024" |

---

## 7. The [fetch](file:///d:/BB/news/src/services/newsService.js#29-38) API — How HTTP Requests Work

```js
async function fetchJson(path, params) {
  const response = await fetch(buildUrl(path, params))
  // fetch() = browser native HTTP client
  // Returns a Promise<Response>
  // await = pause here until response arrives

  if (!response.ok) throw new Error('Failed to fetch')
  // .ok = true if status code is 200–299
  // throw = create an error that catch() will receive

  return response.json()
  // .json() reads the body and parses it as JSON
  // Also returns a Promise
}
```

**async/await explained:**
```js
// Without async/await (Promise chain):
fetch(url)
  .then(res => res.json())
  .then(data => setItems(data))
  .catch(err => setError(err.message))

// With async/await (same thing, reads like sync code):
const res = await fetch(url)
const data = await res.json()
setItems(data)
// errors caught by try/catch
```

---

## 8. Complete Data Flow

```
User types "ai":
  AppBarSearch.handleChange fires on every keystroke
  setTimeout 350ms starts (old timer cancelled first)
  After 350ms with no new keystrokes → onSearch('ai')
  Home.js: setSearchTerm('ai')

NewsList sees query='ai':
  Effect 1: setItems([]), setPage(0) → reset
  Effect 2: newsService.search('ai', 0, {sortBy:'latest'})
    → buildUrl('/search_by_date?query=ai&tags=story&page=0&hitsPerPage=12')
    → fetch() → HTTP GET → JSON response
    → data.hits.map(mapHitToArticle)
      → cleanText() → getTagFromText() → getTagThumbnail()
    → setItems([12 articles])

User scrolls to bottom:
  IntersectionObserver fires (500px early)
  setPage(1) → Effect 2 fetches page 1
  setItems([prev 12 + new 12, deduplicated, sorted])

User clicks ArticleCard:
  navigate('/article/38000000', { state: article })
  ArticleDetails renders
  useState(location.state) → instant display from card data
  useEffect → newsService.getItem('38000000') → fresh data
  setArticle(freshData) → re-render with complete info

User clicks Back:
  navigate('/') → Home page renders again
```

---

## 9. Viva Q&A

**Q: Why `async function` inside `useEffect` instead of making `useEffect` itself async?**
`useEffect` must return a cleanup function (or nothing). An `async` function always returns a Promise. Returning a Promise from useEffect breaks cleanup. Solution: define `async function loadNews()` inside the effect and call it.

**Q: Why `isActive = false` in cleanup?**
If the component unmounts while a fetch is running, the fetch continues in the background. When it resolves, it would call `setState` on an unmounted component → React warning + potential bugs. `isActive = false` in the cleanup prevents any setState after unmount.

**Q: What is event bubbling?**
Click events travel UP the DOM tree. Clicking the "Read original" button fires click on the button, then bubbles up to the Card, which also has an onClick. `stopPropagation()` stops the event at the button — the Card's click never fires.

**Q: Why `useRef` for the timer instead of `useState`?**
Changing `useState` causes a re-render. If we stored the setTimeout ID in state, each keystroke would update state → re-render → break the debounce. `useRef` stores values that persist across renders without triggering a re-render.

**Q: Why data URI SVG thumbnails?**
The API doesn't provide images. Instead of broken image icons, we generate SVG gradients in JavaScript and embed them as `data:image/svg+xml,...` URLs — zero extra network requests.

**Q: Why `Map` in [uniqueById](file:///d:/BB/news/src/features/news/NewsList.js#27-35)?**
`filter + findIndex` = O(n²) — slow for large arrays. `Map.set(key, value)` = O(n) — one pass, hash table lookup. Duplicate keys simply overwrite — deduplication for free.

**Q: Why is `sortBy` state in [Home.js](file:///d:/BB/news/src/pages/Home.js) now instead of [App.js](file:///d:/BB/news/src/App.js)?**
`sortBy` is ONLY used by the Home page (NewsList). ArticleDetails doesn't use it. Keeping state as close to its consumer as possible (local state) is cleaner than hoisting everything to App.js unnecessarily.

**Q: What is the `key` prop in lists?**
React uses `key` to track which list items changed across re-renders. Without it, React re-renders every item even if only one changed. With `key={article.id}`, React identifies each item uniquely and only updates what changed.
