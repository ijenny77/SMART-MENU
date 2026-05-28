import React from 'react'
import TopBar from './components/TopBar'
import HomePage from './components/pages/marketing/HomePage'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './components/pages/auth/SignUpPage'
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}></Route>
      <Route path='/SignUpPage' element={<SignUpPage/>}></Route>
    </Routes>
  )
}

export default App