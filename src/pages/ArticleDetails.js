import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import newsService from '../services/newsService.js'
import { formatDate } from '../utils/date.js'

export default function ArticleDetails() {
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const [article, setArticle] = React.useState(location.state || null)
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState('')

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
                if (!location.state) setArticle(null)
            } finally {
                if (isActive) setLoading(false)
            }
        }

        loadArticle()

        return () => { isActive = false }
    }, [id, location.state])

    if (loading && !article) {
        return (
            <Container maxWidth='md' sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        )
    }

    if (!article) {
        return (
            <Container maxWidth='md' sx={{ mt: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Back</Button>
                <Typography sx={{ mt: 2 }}>Article not found</Typography>
            </Container>
        )
    }

    return (
        <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mb: 2 }}>
                Back
            </Button>

            {error ? (
                <Alert severity='warning' sx={{ mb: 2 }}>{error}</Alert>
            ) : null}

            <Paper sx={{ p: 3 }}>
                {article.thumbnailUrl ? (
                    <Box
                        component='img'
                        src={article.thumbnailUrl}
                        alt='Article cover'
                        sx={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 1, mb: 2 }}
                    />
                ) : null}

                <Typography variant='h5' gutterBottom>
                    {article.title || 'No title'}
                </Typography>

                <Chip
                    label={article.tag || 'general'}
                    size='small'
                    variant='outlined'
                    sx={{ mb: 1, textTransform: 'capitalize' }}
                />

                <Typography variant='subtitle2' color='text.secondary'>
                    {(article.author ? `By ${article.author}` : 'By Unknown author') +
                        (article.publishedAt ? ` | ${formatDate(article.publishedAt)}` : '')}
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <Typography sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                        {article.description || 'No description available for this article.'}
                    </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant='contained'
                        href={article.url || undefined}
                        target='_blank'
                        rel='noopener noreferrer'
                        disabled={!article.url}
                    >
                        Read original
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}
