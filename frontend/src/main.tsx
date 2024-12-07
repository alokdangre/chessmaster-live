import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChessGame from './page/Game'
import Home from './page/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chess-game" element={<ChessGame />} />
            </Routes>
        </BrowserRouter>
  </StrictMode>,
)
