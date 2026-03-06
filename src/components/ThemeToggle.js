import React from 'react'
import { IconButton } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export default function ThemeToggle(props) {
  const mode = props.mode || 'light'
  const toggleMode = props.toggleMode

  return (
    <IconButton onClick={toggleMode} sx={{ position: 'fixed', right: 8, top: 80 }}>
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  )
}
