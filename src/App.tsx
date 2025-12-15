import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MemorialPage from './pages/MemorialPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/m/reg-fulmer" replace />} />
        <Route path="/m/:slug" element={<MemorialPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
