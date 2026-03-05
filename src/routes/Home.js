import React from 'react'
import { Box, Button, Chip, Container, Grid, Typography } from '@mui/material'
import NewsList from '../features/news/NewsList.js'

const quickTags = ['news', 'technology', 'ai', 'business', 'construction', 'finance']
const sortLabels = {
  latest: 'Latest first',
  oldest: 'Oldest first',
  relevance: 'Most relevant'
}

export default function Home(props) {
  const searchTerm = props.searchTerm || ''
  const onTagSelect = props.onTagSelect || function () { }
  const sortBy = props.sortBy || 'latest'
  const onOpenFilters = props.onOpenFilters || function () { }

  return (
    <Container maxWidth='lg' sx={{ mt: 2 }}>
      <Typography variant='h4' gutterBottom>
        Balfour Beatty News
      </Typography>

      <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
        Quick tags
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
          gap: 1,
          flexWrap: 'wrap'
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          Sorting: {sortLabels[sortBy] || sortLabels.latest}
        </Typography>
        <Button size='small' onClick={onOpenFilters}>
          Open filters
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {quickTags.map(function (tag) {
          return (
            <Chip
              key={tag}
              label={tag}
              color={searchTerm === tag ? 'primary' : 'default'}
              variant={searchTerm === tag ? 'filled' : 'outlined'}
              onClick={function () {
                onTagSelect(tag)
              }}
            />
          )
        })}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <NewsList query={searchTerm} sortBy={sortBy} />
        </Grid>
      </Grid>
    </Container>
  )
}
