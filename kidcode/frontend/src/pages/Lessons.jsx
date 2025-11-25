import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { EditIcon, CodeIcon, TrashIcon } from '../components/Icons'

export default function Lessons(){
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('kidcode_user')
      if (raw) setUser(JSON.parse(raw))
    }catch(e){}
    
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

  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin' || user.isAdmin)
  const filteredLessons = filter === 'all' ? lessons : lessons.filter(l => l.difficulty === filter)

  const difficultyColors = {
    'Łatwy': '#10b981',
    'Średni': '#f59e0b',
    'Trudny': '#ef4444'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Wszystkie lekcje</h2>
        {isTeacherOrAdmin && (
          <Link to="/admin"><button className="btn btn-primary">+ Dodaj lekcję</button></Link>
        )}
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button 
          className={filter === 'all' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setFilter('all')}
        >
          Wszystkie ({lessons.length})
        </button>
        <button 
          className={filter === 'Łatwy' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setFilter('Łatwy')}
        >
          Łatwe ({lessons.filter(l=>l.difficulty==='Łatwy').length})
        </button>
        <button 
          className={filter === 'Średni' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setFilter('Średni')}
        >
          Średnie ({lessons.filter(l=>l.difficulty==='Średni').length})
        </button>
        <button 
          className={filter === 'Trudny' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setFilter('Trudny')}
        >
          Trudne ({lessons.filter(l=>l.difficulty==='Trudny').length})
        </button>
      </div>

      {loading && <p className="small">Ładowanie...</p>}
      {!loading && filteredLessons.length === 0 && (
        <p className="small">Brak lekcji w tej kategorii.</p>
      )}
      {!loading && filteredLessons.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {filteredLessons.map((l, idx) => (
            <div key={l.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ 
                      fontSize: 14, 
                      fontWeight: 'bold', 
                      color: '#666',
                      background: '#f3f4f6',
                      padding: '2px 8px',
                      borderRadius: 4
                    }}>
                      #{idx + 1}
                    </span>
                    <Link to={`/lessons/${l.id}`} style={{ fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1f2937' }}>
                      {l.title}
                    </Link>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                    <span style={{ 
                      fontSize: 13, 
                      padding: '3px 10px', 
                      borderRadius: 12, 
                      background: difficultyColors[l.difficulty] + '20',
                      color: difficultyColors[l.difficulty],
                      fontWeight: 600
                    }}>
                      {l.difficulty}
                    </span>
                    <span style={{
                      fontSize: 12,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: l.language === 'python' ? '#3776ab15' : '#f7df1e15',
                      color: l.language === 'python' ? '#3776ab' : '#d4a024',
                      fontWeight: 600,
                      border: `1px solid ${l.language === 'python' ? '#3776ab40' : '#f7df1e40'}`
                    }}>
                      {l.language === 'python' ? '🐍 Python' : '📜 JS'}
                    </span>
                    <span className="small">⏱️ {l.durationMin} min</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link to={`/lessons/${l.id}`}>
                    <button className="btn btn-primary">Rozpocznij →</button>
                  </Link>
                  {isTeacherOrAdmin && (
                    <>
                      <Link to={`/admin/${l.id}`}>
                        <button className="btn btn-outline">Edytuj</button>
                      </Link>
                      <button className="btn btn-ghost" onClick={()=>handleDelete(l.id)} title="Usuń">
                        <TrashIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
