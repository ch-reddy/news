import React, { useMemo, useState } from 'react'
import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import AppBarSearch from './components/AppBarSearch.js'
import FiltersDrawer from './components/FiltersDrawer.js'
import ThemeToggle from './components/ThemeToggle.js'
import AppRoutes from './routes/AppRoutes.js'
import { getTheme } from './theme.js'

export default function App () {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState('latest')
  const [mode, setMode] = useState('light')
  const theme = useMemo(() => getTheme(mode), [mode])

  function handleSearchTermChange (value) {
    setSearchTerm(value)
  }

  function handleToggleMode () {
    setMode(function (currentMode) {
      return currentMode === 'light' ? 'dark' : 'light'
    })
  }

  function handleOpenFilters () {
    setFiltersOpen(true)
  }

  function handleCloseFilters () {
    setFiltersOpen(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <header>
          <AppBarSearch
            onSearch={handleSearchTermChange}
            onOpenFilters={handleOpenFilters}
          />
          <ThemeToggle mode={mode} toggleMode={handleToggleMode} />
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
            onSearchTermChange={handleSearchTermChange}
            onOpenFilters={handleOpenFilters}
          />
        </main>
      </Box>
    </ThemeProvider>
  )
}
