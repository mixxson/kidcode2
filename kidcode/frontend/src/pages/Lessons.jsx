import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { progressAPI } from '../services/api'
import { EditIcon, CodeIcon, TrashIcon } from '../components/Icons'

export default function Lessons(){
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all') // all, new, in-progress, completed
  const [user, setUser] = useState(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('kidcode_user')
      if (raw) setUser(JSON.parse(raw))
    }catch(e){}
    
    loadData()
  },[])

  async function loadData(){
    setLoading(true)
    try{
      const lessonsRes = await api.get('/lessons')
      setLessons(lessonsRes.data.lessons || [])
      
      // Load progress if logged in
      const token = localStorage.getItem('kidcode_token')
      if(token){
        try{
          const progressRes = await progressAPI.getUserProgress()
          setProgress(progressRes.data.progress || [])
        }catch(err){
          console.log('Progress not loaded (maybe not logged in)')
        }
      }
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  async function handleDelete(id){
    if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
    try{
      await api.delete(`/lessons/${id}`)
      setLessons(prev => prev.filter(l => l.id !== id))
    }catch(err){
      alert('Błąd podczas usuwania')
    }
  }

  function getStatus(lessonId){
    const entry = progress.find(p => p.lessonId === lessonId)
    return entry ? entry.status : 'new'
  }

  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin' || user.isAdmin)
  
  // Filter by tab (progress status)
  const filteredLessons = lessons.filter(lesson => {
    const status = getStatus(lesson.id)
    if (tab === 'all') return true
    if (tab === 'new') return status === 'new'
    if (tab === 'in-progress') return status === 'in-progress'
    if (tab === 'completed') return status === 'completed'
    return true
  })

  const stats = {
    all: lessons.length,
    new: lessons.filter(l => getStatus(l.id) === 'new').length,
    inProgress: lessons.filter(l => getStatus(l.id) === 'in-progress').length,
    completed: lessons.filter(l => getStatus(l.id) === 'completed').length
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Moje lekcje</h2>
        {isTeacherOrAdmin && (
          <Link to="/admin"><button className="btn btn-primary">+ Dodaj lekcję</button></Link>
        )}
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button 
          className={tab === 'all' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setTab('all')}
        >
          📚 Wszystkie ({stats.all})
        </button>
        <button 
          className={tab === 'new' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setTab('new')}
        >
          🆕 Nowe ({stats.new})
        </button>
        <button 
          className={tab === 'in-progress' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setTab('in-progress')}
        >
          ⏳ W trakcie ({stats.inProgress})
        </button>
        <button 
          className={tab === 'completed' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={()=>setTab('completed')}
        >
          ✅ Zakończone ({stats.completed})
        </button>
      </div>

      {loading && <p className="small">Ładowanie...</p>}
      {!loading && filteredLessons.length === 0 && (
        <p className="small">Brak lekcji w tej kategorii.</p>
      )}
      {!loading && filteredLessons.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {filteredLessons.map((l, idx) => {
            const status = getStatus(l.id)
            const statusInfo = statusBadges[status]
            
            return (
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
                        #{lessons.indexOf(l) + 1}
                      </span>
                      <Link to={`/lessons/${l.id}`} style={{ fontSize: 18, fontWeight: 'bold', textDecoration: 'none', color: '#1f2937' }}>
                        {l.title}
                      </Link>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                      <span style={{ 
                        fontSize: 13, 
                        padding: '3px 10px', 
                        borderRadius: 12, 
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        fontWeight: 600
                      }}>
                        {statusInfo.icon} {statusInfo.label}
                      </span>
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
                      <button className="btn btn-primary">
                        {status === 'completed' ? 'Powtórz' : status === 'in-progress' ? 'Kontynuuj →' : 'Rozpocznij →'}
                      </button>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
