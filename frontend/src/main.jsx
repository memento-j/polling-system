import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './pages/App.jsx'
import Poll from './pages/Poll.jsx'
import Vote from './pages/Vote.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import UserContextProvider from './context/UserContext.jsx'
import CurrentPolls from './pages/CurrentPolls.jsx'
import UserHome from './pages/UserHome.jsx'
import NotFound from './pages/NotFound.jsx'

createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CurrentPolls />} />
        <Route path="/poll" element={<Poll />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/login" element={<Login />} />        
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-poll" element={<App />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </UserContextProvider>
)
