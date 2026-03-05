import React from 'react'
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider
} from '@mui/material'

export default function FiltersDrawer (props) {
  const open = Boolean(props.open)
  const onClose = props.onClose || function () {}
  const sortBy = props.sortBy || 'latest'
  const onChangeSortBy = props.onChangeSortBy || function () {}

  function handleSortChange (event) {
    onChangeSortBy(event.target.value)
  }

  function resetFilters () {
    onChangeSortBy('latest')
  }

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 2 }}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Filters and Sorting
        </Typography>

        <FormControl component='fieldset' fullWidth>
          <FormLabel component='legend'>Sort Order</FormLabel>
          <RadioGroup value={sortBy} onChange={handleSortChange}>
            <FormControlLabel value='latest' control={<Radio />} label='Latest first' />
            <FormControlLabel value='oldest' control={<Radio />} label='Oldest first' />
            <FormControlLabel value='relevance' control={<Radio />} label='Most relevant' />
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant='text' onClick={resetFilters}>
            Reset
          </Button>
          <Button variant='contained' onClick={onClose}>
            Done
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
