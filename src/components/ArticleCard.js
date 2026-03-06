import React from 'react'
import { Box, Button, Card, CardActions, CardContent, Chip, Typography } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/date.js'

export default function ArticleCard(props) {
  const article = props.article || {}
  const featured = Boolean(props.featured)
  const navigate = useNavigate()

  function openDetails() {
    navigate(`/article/${article.id}`, { state: article })
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDetails()
    }
  }

  function handleReadOriginalClick(event) {
    event.stopPropagation()
  }

  return (
    <Card
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      role='button'
      tabIndex={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: featured ? 320 : 220,
        cursor: 'pointer'
      }}
    >
      <Box
        sx={{
          height: featured ? 150 : 95,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.200',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {article.thumbnailUrl ? (
          <Box
            component='img'
            src={article.thumbnailUrl}
            alt='Article thumbnail'
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <ImageIcon sx={{ fontSize: 48, color: 'grey.600' }} />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent sx={{ pb: 1 }}>
          <Typography
            variant={featured ? 'h5' : 'h6'}
            gutterBottom
            sx={{
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: featured ? 2 : 1
            }}
          >
            {article.title || 'No title'}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{
              mb: 1,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: featured ? 4 : 2
            }}
          >
            {article.description || 'No description available'}
          </Typography>

          <Chip
            label={article.tag || 'general'}
            size='small'
            variant='outlined'
            sx={{ mb: 1, textTransform: 'capitalize' }}
          />

          <Typography variant='caption' color='text.secondary'>
            {(article.source || 'Unknown source') +
              (article.publishedAt ? ` | ${formatDate(article.publishedAt)}` : '')}
          </Typography>
        </CardContent>

        <CardActions sx={{ mt: 'auto' }}>
          <Button
            size='small'
            variant='outlined'
            href={article.url || undefined}
            target='_blank'
            rel='noopener noreferrer'
            disabled={!article.url}
            onClick={handleReadOriginalClick}
          >
            Read original
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}
