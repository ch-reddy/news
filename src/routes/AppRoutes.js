import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ArticleDetails from './ArticleDetails.js'
import Home from './Home.js'

export default function AppRoutes (props) {
  const searchTerm = props.searchTerm || ''
  const sortBy = props.sortBy || 'latest'
  const onSearchTermChange = props.onSearchTermChange || function () {}
  const onOpenFilters = props.onOpenFilters || function () {}

  return (
    <Routes>
      <Route
        path='/'
        element={
          <Home
            searchTerm={searchTerm}
            onTagSelect={onSearchTermChange}
            sortBy={sortBy}
            onOpenFilters={onOpenFilters}
          />
        }
      />
      <Route path='/article/:id' element={<ArticleDetails />} />
    </Routes>
  )
}
