import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'
import SyncStatus from './components/SyncStatus'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Lessons from './pages/Lessons'
import Lesson from './pages/Lesson'
import Editor from './pages/Editor'
import Admin from './pages/Admin'
import TeacherDashboard from './pages/TeacherDashboard'
import CodeRoom from './pages/CodeRoom'
import RoomsList from './pages/RoomsList'
import RoomCreate from './pages/RoomCreate'
import Login from './pages/Login'
import Register from './pages/Register'
import './styles/index.css'

export default function App(){
  return (
    <SocketProvider>
      <BrowserRouter>
        <SyncStatus />
        <Routes>
          {/* Pages with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/dashboard" element={<Layout><TeacherDashboard /></Layout>} />
          <Route path="/lessons" element={<Layout><Lessons /></Layout>} />
          <Route path="/lessons/:id" element={<Layout><Lesson /></Layout>} />
          <Route path="/editor/:id" element={<Layout fullWidth><Editor /></Layout>} />
          <Route path="/rooms" element={<Layout><RoomsList /></Layout>} />
          <Route path="/rooms/new" element={<Layout><RoomCreate /></Layout>} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/admin/:id" element={<Layout><Admin /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          
          {/* CodeRoom - fullWidth for editor */}
          <Route path="/rooms/:id" element={<Layout fullWidth><CodeRoom /></Layout>} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  )
}
