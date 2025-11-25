import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../services/api'
import { TrashIcon, CodeIcon } from '../components/Icons'

export default function Lesson(){
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/lessons/${id}`)
      .then(r => setLesson(r.data.lesson))
      .catch(()=> setLesson(null))
  },[id])

  if (!lesson) return <p className="small">Ładowanie lekcji...</p>

  const navigate = useNavigate()

  async function handleDelete(){
    if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
    try{
      await api.delete(`/lessons/${lesson.id}`)
      navigate('/')
    }catch(err){
      alert('Błąd podczas usuwania')
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{lesson.title}</h2>
      <div className="small" style={{ marginBottom: 12 }}>{lesson.difficulty} — {lesson.durationMin} min</div>
      <div className="card" style={{ padding: 14 }} dangerouslySetInnerHTML={{ __html: lesson.content }} />
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to={`/editor/${lesson.id}`}><button className="icon-btn"><CodeIcon />Otwórz edytor</button></Link>
        <button className="icon-btn danger" onClick={handleDelete}><TrashIcon />Usuń lekcję</button>
        <Link to="/" style={{ marginLeft: 12 }}><button className="btn btn-ghost">Powrót</button></Link>
      </div>
    </div>
  )
}
