import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { TrashIcon, CodeIcon } from '../components/Icons'

export default function Lesson(){
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  useEffect(()=>{
    api.get(`/lessons/${id}`)
      .then(r => setLesson(r.data.lesson))
      .catch((err)=> {
        console.error('Error loading lesson:', err)
        setLesson(null)
      })
  },[id])

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

  const difficultyColors = {
    'Łatwy': '#10b981',
    'Średni': '#f59e0b',
    'Trudny': '#ef4444'
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to="/lessons" className="small" style={{ color: '#6b7280', textDecoration: 'none' }}>
          ← Powrót do lekcji
        </Link>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{lesson.title}</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
        <Link to={`/editor/${lesson.id}`}>
          <button className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <CodeIcon /> Rozpocznij kodowanie
          </button>
        </Link>
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
