import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Lesson from './pages/Lesson'
import Editor from './pages/Editor'
import Admin from './pages/Admin'
import CodeRoom from './pages/CodeRoom'
import Login from './pages/Login'
import Register from './pages/Register'
import './styles/index.css'

export default function App(){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('kidcode_user')
      if (raw) setUser(JSON.parse(raw))
    }catch(e){ }
  },[])

  function logout(){
    localStorage.removeItem('kidcode_token')
    localStorage.removeItem('kidcode_user')
    setUser(null)
    // reload to clear any state
    window.location.href = '/'
  }

  return (
    <BrowserRouter>
      <div className="container">
        <header className="header">
          <Link to="/" className="brand">KidCode</Link>
          <nav className="nav">
            <Link to="/lessons">Lekcje</Link>
            {user && user.isAdmin ? <Link to="/admin">Admin</Link> : null}
            {!user ? (
              <>
                <Link to="/login">Zaloguj</Link>
                <Link to="/register">Rejestracja</Link>
              </>
            ) : (
              <a href="#" onClick={(e)=>{e.preventDefault(); logout()}}>Wyloguj</a>
            )}
          </nav>
        </header>

        <div className="card">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/lessons/:id" element={<Lesson />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/rooms/:id" element={<CodeRoom />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:id" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
