import React, { useState } from 'react'
import { Box, Button, Chip, Container, Grid, Typography } from '@mui/material'
import AppBarSearch from '../components/AppBarSearch.js'
import FiltersDrawer from '../components/FiltersDrawer.js'
import ThemeToggle from '../components/ThemeToggle.js'
import NewsList from '../features/news/NewsList.js'

const quickTags = ['news', 'technology', 'ai', 'business', 'construction', 'finance']
const sortLabels = {
    latest: 'Latest first',
    oldest: 'Oldest first',
    relevance: 'Most relevant'
}

export default function Home(props) {
    const mode = props.mode || 'light'
    const onToggleMode = props.onToggleMode || function () { }

    const [searchTerm, setSearchTerm] = useState('')
    const [filtersOpen, setFiltersOpen] = useState(false)
    const [sortBy, setSortBy] = useState('latest')

    function handleOpenFilters() {
        setFiltersOpen(true)
    }

    function handleCloseFilters() {
        setFiltersOpen(false)
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <AppBarSearch onSearch={setSearchTerm} onOpenFilters={handleOpenFilters} />
            <ThemeToggle mode={mode} toggleMode={onToggleMode} />

            <FiltersDrawer
                open={filtersOpen}
                onClose={handleCloseFilters}
                sortBy={sortBy}
                onChangeSortBy={setSortBy}
            />

            <main style={{ flex: 1, padding: 16 }}>
                <Container maxWidth='lg' sx={{ mt: 2 }}>
                    <Typography variant='h4' gutterBottom>
                        Balfour Beatty News
                    </Typography>

                    <Typography variant='subtitle2' color='text.secondary' sx={{ mb: 1 }}>
                        Quick tags
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant='body2' color='text.secondary'>
                            Sorting: {sortLabels[sortBy] || sortLabels.latest}
                        </Typography>
                        <Button size='small' onClick={handleOpenFilters}>
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
                                    onClick={function () { setSearchTerm(tag) }}
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
            </main>
        </Box>
    )
}
