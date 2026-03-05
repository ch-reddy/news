import React, { useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.js'
import ArticleDetails from './pages/ArticleDetails.js'
import { getTheme } from './theme.js'

export default function App() {
  const [mode, setMode] = useState('light')
  const theme = useMemo(() => getTheme(mode), [mode])

  function handleToggleMode() {
    setMode(function (current) {
      return current === 'light' ? 'dark' : 'light'
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path='/' element={<Home mode={mode} onToggleMode={handleToggleMode} />} />
        <Route path='/article/:id' element={<ArticleDetails />} />
      </Routes>
    </ThemeProvider>
  )
}
