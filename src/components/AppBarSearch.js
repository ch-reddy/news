import React from 'react'
import { AppBar, Toolbar, Typography, InputBase, IconButton, Box } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'

export default function AppBarSearch (props) {
  const onSearch = props.onSearch || function () {}
  const onOpenFilters = props.onOpenFilters || function () {}
  const [value, setValue] = React.useState('')
  const timeoutRef = React.useRef(null)

  function handleChange (e) {
    const nextValue = e.target.value
    setValue(nextValue)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      onSearch(nextValue)
    }, 350)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          Balfour Beatty News
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InputBase
            placeholder='Search'
            value={value}
            onChange={handleChange}
            sx={{
              color: 'inherit',
              ml: 1,
              background: 'rgba(255,255,255,0.12)',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              minWidth: { xs: 120, sm: 240 }
            }}
          />
          <IconButton color='inherit' sx={{ ml: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <IconButton color='inherit' onClick={onOpenFilters} sx={{ ml: 1 }}>
          <FilterListIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
