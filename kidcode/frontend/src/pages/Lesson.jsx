import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api, { progressAPI } from '../services/api'
import { TrashIcon, CodeIcon } from '../components/Icons'

export default function Lesson(){
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('new')
  const navigate = useNavigate()

  useEffect(()=>{
    const userData = localStorage.getItem('kidcode_user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  useEffect(()=>{
    loadLesson()
  },[id])

  async function loadLesson(){
    try{
      const r = await api.get(`/lessons/${id}`)
      setLesson(r.data.lesson)
      
      // Load progress status
      const token = localStorage.getItem('kidcode_token')
      if(token){
        try{
          const progressRes = await progressAPI.getLessonProgress(id)
          setStatus(progressRes.data.progress?.status || 'new')
        }catch(err){
          setStatus('new')
        }
      }
    }catch(err){
      console.error('Error loading lesson:', err)
      setLesson(null)
    }
  }

  if (!lesson) return <p className="small">Ładowanie lekcji...</p>

  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin' || user.isAdmin)

  async function handleDelete(){
    if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
    try{
      await api.delete(`/lessons/${lesson.id}`)
      navigate('/lessons')
    }catch(err){
      alert('Błąd podczas usuwania')
    }
  }

  async function handleStartCoding(){
    // Mark as in-progress when starting to code
    const token = localStorage.getItem('kidcode_token')
    if(token && status === 'new'){
      try{
        await progressAPI.updateLessonProgress(id, 'in-progress')
        setStatus('in-progress')
      }catch(err){
        console.error('Failed to update progress:', err)
      }
    }
    navigate(`/editor/${lesson.id}`)
  }

  async function handleMarkComplete(){
    const token = localStorage.getItem('kidcode_token')
    if(!token){
      alert('Musisz być zalogowany, aby zapisać postęp')
      return
    }
    try{
      await progressAPI.updateLessonProgress(id, 'completed')
      setStatus('completed')
      alert('✅ Gratulacje! Lekcja oznaczona jako zakończona!')
    }catch(err){
      alert('Błąd podczas zapisywania postępu')
    }
  }

  const difficultyColors = {
    'Łatwy': '#10b981',
    'Średni': '#f59e0b',
    'Trudny': '#ef4444'
  }

  const statusBadges = {
    'new': { bg: '#e5e7eb', color: '#6b7280', label: 'Nowa', icon: '🆕' },
    'in-progress': { bg: '#dbeafe', color: '#1d4ed8', label: 'W trakcie', icon: '⏳' },
    'completed': { bg: '#d1fae5', color: '#059669', label: 'Zakończona', icon: '✅' }
  }

  const statusInfo = statusBadges[status]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/lessons" className="small" style={{ color: '#6b7280', textDecoration: 'none' }}>
          ← Powrót do lekcji
        </Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{lesson.title}</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ 
            fontSize: 13, 
            padding: '4px 12px', 
            borderRadius: 12, 
            background: statusInfo.bg,
            color: statusInfo.color,
            fontWeight: 600
          }}>
            {statusInfo.icon} {statusInfo.label}
          </span>
          <span style={{ 
            fontSize: 13, 
            padding: '4px 12px', 
            borderRadius: 12, 
            background: difficultyColors[lesson.difficulty] + '20',
            color: difficultyColors[lesson.difficulty],
            fontWeight: 600
          }}>
            {lesson.difficulty}
          </span>
          <span className="small">⏱️ {lesson.durationMin} min</span>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16, lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: lesson.content }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={handleStartCoding}>
          <CodeIcon /> {status === 'new' ? 'Rozpocznij kodowanie' : 'Kontynuuj kodowanie'}
        </button>
        {status !== 'completed' && (
          <button className="btn btn-outline" onClick={handleMarkComplete}>
            ✅ Oznacz jako zakończoną
          </button>
        )}
        {status === 'completed' && (
          <span style={{ 
            padding: '8px 16px', 
            background: '#d1fae5', 
            color: '#059669',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14
          }}>
            🎉 Lekcja ukończona!
          </span>
        )}
        {isTeacherOrAdmin && (
          <>
            <Link to={`/admin/${lesson.id}`}>
              <button className="btn btn-outline">Edytuj lekcję</button>
            </Link>
            <button className="btn btn-ghost" onClick={handleDelete} title="Usuń lekcję">
              <TrashIcon /> Usuń
            </button>
          </>
        )}
      </div>
    </div>
  )
}
