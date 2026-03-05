import React, { useState } from 'react'
import { Box } from '@mui/material'
import AppBarSearch from './AppBarSearch.js'
import FiltersDrawer from './FiltersDrawer.js'
import ThemeToggle from './ThemeToggle.js'
import AppRoutes from '../routes/AppRoutes.js'

export default function AppLayout(props) {
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
            <header>
                <AppBarSearch
                    onSearch={setSearchTerm}
                    onOpenFilters={handleOpenFilters}
                />
                <ThemeToggle mode={mode} toggleMode={onToggleMode} />
            </header>

            <FiltersDrawer
                open={filtersOpen}
                onClose={handleCloseFilters}
                sortBy={sortBy}
                onChangeSortBy={setSortBy}
            />

            <main style={{ flex: 1, padding: 16 }}>
                <AppRoutes
                    searchTerm={searchTerm}
                    sortBy={sortBy}
                    onSearchTermChange={setSearchTerm}
                    onOpenFilters={handleOpenFilters}
                />
            </main>
        </Box>
    )
}
