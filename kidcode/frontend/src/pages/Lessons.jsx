import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { EditIcon, CodeIcon, TrashIcon } from '../components/Icons'

export default function Lessons(){
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    api.get('/lessons').then(r => setLessons(r.data.lessons || [])).catch(()=>{}).finally(()=>setLoading(false))
  },[])

  async function handleDelete(id){
    if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
    try{
      await api.delete(`/lessons/${id}`)
      setLessons(prev => prev.filter(l => l.id !== id))
    }catch(err){
      alert('Błąd podczas usuwania')
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Wszystkie lekcje</h2>
      {loading && <p className="small">Ładowanie...</p>}
      {!loading && (
        <ul className="list">
          {lessons.map(l => (
            <li key={l.id} className="lesson-item">
              <div>
                <Link className="lesson-title" to={`/lessons/${l.id}`}>{l.title}</Link>
                <div className="lesson-meta">{l.difficulty} — {l.durationMin} min</div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <Link to={`/admin/${l.id}`}><button className="icon-btn"><EditIcon />Edytuj</button></Link>
                <Link to={`/editor/${l.id}`}><button className="icon-btn"><CodeIcon />Edytor</button></Link>
                <button className="icon-only" title="Usuń lekcję" onClick={()=>handleDelete(l.id)}><TrashIcon /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
