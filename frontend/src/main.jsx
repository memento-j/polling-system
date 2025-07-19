import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './pages/App.jsx'
import Poll from './pages/Poll.jsx'
import Vote from './pages/Vote.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/poll" element={<Poll />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/login" element={<Login />} />        
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
)
