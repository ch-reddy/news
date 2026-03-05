const API_BASE_URL = 'https://hn.algolia.com/api/v1'
const PAGE_SIZE = 12

const TAG_COLORS = {
  ai: ['#4527a0', '#283593'],
  technology: ['#1565c0', '#00838f'],
  business: ['#2e7d32', '#558b2f'],
  finance: ['#00695c', '#2e7d32'],
  construction: ['#ef6c00', '#6d4c41'],
  startups: ['#ad1457', '#6a1b9a'],
  discussion: ['#37474f', '#455a64'],
  general: ['#5d4037', '#455a64']
}

function buildUrl (path, params = {}) {
  const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(normalizedPath, normalizedBase)

  Object.entries(params).forEach(function ([key, value]) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

async function fetchJson (path, params) {
  const response = await fetch(buildUrl(path, params))

  if (!response.ok) {
    throw new Error('Failed to fetch news data')
  }

  return response.json()
}

function decodeHtmlEntities (text) {
  return text
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')
    .replace(/&nbsp;/gi, ' ')
}

function cleanText (value) {
  if (!value) return ''

  return decodeHtmlEntities(
    String(value)
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim()
  )
}

function getTagFromText (title, description, sourceTags) {
  const haystack = `${title} ${description} ${(sourceTags || []).join(' ')}`.toLowerCase()

  if (/ai|artificial intelligence|llm|ml|machine learning|gpt/.test(haystack)) return 'ai'
  if (/fintech|finance|stock|market|funding|investment/.test(haystack)) return 'finance'
  if (/build|civil|architecture|construction|infra/.test(haystack)) return 'construction'
  if (/startup|founder|launch|producthunt|mvp/.test(haystack)) return 'startups'
  if (/business|b2b|revenue|sales/.test(haystack)) return 'business'
  if (/show_hn|ask_hn|discussion|comment/.test(haystack)) return 'discussion'
  if (/tech|software|developer|programming|web|mobile|cloud|security/.test(haystack)) return 'technology'

  return 'general'
}

function getTagThumbnail (tag) {
  const colors = TAG_COLORS[tag] || TAG_COLORS.general
  const label = (tag || 'general').toUpperCase()
  const svg = [
    "<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675' viewBox='0 0 1200 675'>",
    "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>",
    `<stop offset='0%' stop-color='${colors[0]}'/>`,
    `<stop offset='100%' stop-color='${colors[1]}'/>`,
    '</linearGradient></defs>',
    "<rect width='1200' height='675' fill='url(#g)'/>",
    "<circle cx='1080' cy='100' r='140' fill='rgba(255,255,255,0.12)'/>",
    "<circle cx='130' cy='560' r='180' fill='rgba(255,255,255,0.08)'/>",
    "<rect x='58' y='52' rx='24' ry='24' width='220' height='72' fill='rgba(255,255,255,0.22)'/>",
    `<text x='84' y='99' font-family='Segoe UI, Arial' font-size='38' fill='white' opacity='0.95'>${label}</text>`,
    '</svg>'
  ].join('')

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function mapHitToArticle (hit) {
  const title = cleanText(hit.title || hit.story_title || 'No title')
  const description = cleanText(hit.story_text || hit.comment_text || '')
  const tag = getTagFromText(title, description, hit._tags)

  return {
    id: hit.objectID,
    title,
    description,
    url: hit.url || hit.story_url || '',
    source: 'Hacker News',
    author: hit.author || 'Unknown author',
    publishedAt: hit.created_at || '',
    tag,
    thumbnailUrl: getTagThumbnail(tag)
  }
}

function mapItemToArticle (item) {
  const title = cleanText(item.title || 'No title')
  const description = cleanText(item.text || '')
  const tag = getTagFromText(title, description, item.children ? ['discussion'] : [])

  return {
    id: item.id || '',
    title,
    description,
    url: item.url || '',
    source: 'Hacker News',
    author: item.author || 'Unknown author',
    publishedAt: item.created_at || '',
    tag,
    thumbnailUrl: getTagThumbnail(tag)
  }
}

const newsService = {
  async search (query = 'news', page = 0, options = {}) {
    const sortBy = options.sortBy || 'latest'
    const endpoint = sortBy === 'relevance' ? '/search' : '/search_by_date'
    const data = await fetchJson(endpoint, {
      query,
      tags: 'story',
      page,
      hitsPerPage: PAGE_SIZE
    })

    return {
      items: (data.hits || []).map(mapHitToArticle),
      hasMore: page + 1 < (data.nbPages || 0)
    }
  },

  async getItem (id) {
    const data = await fetchJson(`/items/${id}`)
    return mapItemToArticle(data)
  }
}

export default newsService
