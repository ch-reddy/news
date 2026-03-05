import React from 'react'
import { Alert, Box, Button, Grid, Skeleton, Snackbar, Typography } from '@mui/material'
import ArticleCard from '../../components/ArticleCard.js'
import newsService from '../../services/newsService.js'

const skeletonItems = [0, 1, 2, 3]

function sortItems(list, sortMode) {
  const sorted = list.slice()

  if (sortMode === 'oldest') {
    sorted.sort(function (a, b) {
      return new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime()
    })
    return sorted
  }

  if (sortMode === 'latest') {
    sorted.sort(function (a, b) {
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    })
  }

  return sorted
}

function uniqueById(list) {
  const map = new Map()
  list.forEach(function (item) {
    if (!item || !item.id) return
    map.set(item.id, item)
  })
  return Array.from(map.values())
}

export default function NewsList(props) {
  const query = props.query || ''
  const sortBy = props.sortBy || 'latest'
  const [page, setPage] = React.useState(0)
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [hasMore, setHasMore] = React.useState(true)
  const loadMoreRef = React.useRef(null)

  React.useEffect(() => {
    setItems([])
    setPage(0)
    setHasMore(true)
  }, [query, sortBy])

  React.useEffect(() => {
    let isActive = true

    async function loadNews() {
      setLoading(true)
      setError('')

      try {
        const result = await newsService.search(query || 'news', page, { sortBy: sortBy })

        if (!isActive) return

        setItems(function (previousItems) {
          const merged = page === 0 ? result.items : previousItems.concat(result.items)
          const uniqueItems = uniqueById(merged)
          return sortItems(uniqueItems, sortBy)
        })

        setHasMore(result.hasMore)
      } catch (err) {
        if (!isActive) return
        setError(err.message || 'Failed to load news')
      } finally {
        if (isActive) setLoading(false)
      }
    }

    loadNews()

    return () => {
      isActive = false
    }
  }, [query, page, sortBy])

  React.useEffect(() => {
    const currentTarget = loadMoreRef.current
    if (!currentTarget) return

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0]
        if (firstEntry && firstEntry.isIntersecting && hasMore && !loading) {
          setPage(currentPage => {
            return currentPage + 1
          })
        }
      },
      { rootMargin: '500px 0px' }
    )

    observer.observe(currentTarget)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, loading])

  function retry() {
    setError('')
    setItems([])
    setPage(0)
    setHasMore(true)
  }

  return (
    <Box>
      {loading && items.length === 0 ? (
        <Grid container spacing={2}>
          {skeletonItems.map(function (index) {
            return (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant='rectangular' height={180} />
              </Grid>
            )
          })}
        </Grid>
      ) : null}

      {!loading && items.length === 0 ? <Typography>No articles found</Typography> : null}

      {items.length > 0 ? (
        <Grid container spacing={2}>
          {items.map(function (article, index) {
            return (
              <Grid
                item
                xs={12}
                md={index === 0 ? 12 : 6}
                lg={index === 0 ? 12 : 4}
                key={article.id}
              >
                <ArticleCard article={article} featured={index === 0} />
              </Grid>
            )
          })}
        </Grid>
      ) : null}

      <Box ref={loadMoreRef} sx={{ height: 20 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        {loading && items.length > 0 ? <Typography>Loading more...</Typography> : null}
        {!hasMore && items.length > 0 ? <Typography>No more results</Typography> : null}
      </Box>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => {
          setError('')
        }}
      >
        <Alert
          severity='error'
          onClose={() => {
            setError('')
          }}
          action={
            <Button color='inherit' size='small' onClick={retry}>
              Retry
            </Button>
          }
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
