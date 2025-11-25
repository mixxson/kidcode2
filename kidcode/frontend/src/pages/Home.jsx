import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { TrashIcon, EditIcon, CodeIcon } from '../components/Icons'

export default function Home(){
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [user, setUser] = useState(null)
  
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('kidcode_user')
      if (raw) setUser(JSON.parse(raw))
    }catch(e){}
  },[])

    const features = [
      { id: 'lessons', title: 'Interaktywne lekcje', short: 'Krótkie moduły z przykładami i ćwiczeniami.', long: 'Interaktywne lekcje zawierają krótkie wprowadzenia, przykłady i małe zadania praktyczne dla dzieci. Każda lekcja ma starter code oraz opis, który można edytować w panelu administracyjnym.' },
      { id: 'editor', title: 'Wbudowany edytor', short: 'Uruchamiaj kod w przeglądarce.', long: 'Edytor działa w piaskownicy (iframe) — użytkownik może pisać JavaScript i natychmiast zobaczyć wynik. To bezpieczne środowisko do nauki podstaw.' },
      { id: 'admin', title: 'Panel administracyjny', short: 'Twórz i edytuj lekcje.', long: 'Panel administracyjny pozwala tworzyć nowe lekcje, edytować istniejące oraz dbać o treści. Dane są zapisywane w pliku JSON podczas developmentu; w produkcji warto użyć bazy danych.' }
    ]
  useEffect(()=>{
    axios.get('http://localhost:4000/api/lessons')
      .then(r => { setLessons(r.data.lessons); setLoading(false) })
      .catch(()=> setLoading(false))
  },[])

  const lessonCount = lessons.length

  const isStudent = user && user.role === 'student'
  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin' || user.isAdmin)

  return (
    <div>
      <section style={{ marginBottom: 18 }}>
        <h2 style={{ margin: '0 0 8px 0' }}>Witaj w KidCode</h2>
        <p className="small">
          {isStudent ? 'Ucz się programowania krok po kroku z interaktywnymi lekcjami!' : 'Interaktywna platforma do nauki programowania dla dzieci — lekcje, prosty edytor i system zarządzania treścią.'}
        </p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Link to="/lessons"><button className="btn btn-outline">Przeglądaj wszystkie lekcje</button></Link>
          {isTeacherOrAdmin && <Link to="/admin"><button className="btn btn-primary">Dodaj nową lekcję</button></Link>}
          {user && <Link to="/rooms"><button className="btn btn-primary">Moje pokoje</button></Link>}
        </div>
      </section>

      <section style={{ marginBottom: 18 }} className="card">
        <h3 style={{ marginTop: 0 }}>Co potrafi aplikacja</h3>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
            {features.map((f, idx) => (
              <div key={f.id} role="button" tabIndex={0} onClick={()=>setSelectedFeature(f)} onKeyDown={(e)=>{ if(e.key==='Enter') setSelectedFeature(f)}} className={`card feature-card feature-${idx+1}`} style={{ padding: 16 }}>
                <strong>{f.title}</strong>
                <div className="small">{f.short}</div>
              </div>
            ))}
          </div>

          {selectedFeature && (
            <div style={{ marginTop: 14 }} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ marginTop: 0 }}>{selectedFeature.title}</h4>
                  <p className="small">{selectedFeature.long}</p>
                </div>
                <div>
                  <button className="btn btn-ghost" onClick={()=>setSelectedFeature(null)}>Zamknij</button>
                </div>
              </div>
            </div>
          )}
      </section>

      {!isStudent && (
        <section style={{ marginBottom: 18 }} className="card">
          <h3 style={{ marginTop: 0 }}>Szybki start</h3>
          <ol className="small">
            <li>Uruchom backend: <code>cd backend && npm install && npm run dev</code></li>
            <li>Uruchom frontend: <code>cd frontend && npm install && npm run dev</code></li>
            <li>Otwórz w przeglądarce adres podany przez Vite (domyślnie <strong>http://localhost:5173</strong>)</li>
          </ol>
        </section>
      )}

      <section style={{ marginBottom: 18 }}>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>Statystyki</h3>
            <div className="small">Liczba lekcji: <strong>{lessonCount}</strong></div>
          </div>
          <div className="small">Szybkie linki: <Link to="/admin">Admin</Link> • <a href="/docs/install.md">Docs</a></div>
        </div>
      </section>

      <section>
        <h3 style={{ marginTop: 0 }}>{isStudent ? 'Najbliższe lekcje' : 'Ostatnie lekcje'}</h3>
        {loading && <p className="small">Ładowanie...</p>}
        {!loading && lessons.length === 0 && <p className="small">Brak lekcji. {isTeacherOrAdmin && 'Dodaj pierwszą!'}</p>}
        {!loading && lessons.length > 0 && (
          <ul className="list">
            {(isStudent ? lessons.slice(0, 3) : lessons).map(l => (
              <li key={l.id} className="lesson-item">
                <div>
                  <Link className="lesson-title" to={`/lessons/${l.id}`}>{l.title}</Link>
                  <div className="lesson-meta">{l.difficulty} — {l.durationMin} min</div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <Link to={`/lessons/${l.id}`}><button className="icon-btn"><CodeIcon />Rozpocznij</button></Link>
                  {isTeacherOrAdmin && (
                    <>
                      <Link to={`/admin/${l.id}`}><button className="icon-btn"><EditIcon />Edytuj</button></Link>
                      <button className="icon-only" title="Usuń lekcję" onClick={async ()=>{
                        if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
                        try{
                          await api.delete(`/lessons/${l.id}`)
                          setLessons(prev => prev.filter(x => x.id !== l.id))
                        }catch(err){
                          alert('Błąd podczas usuwania')
                        }
                      }}><TrashIcon /></button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {isStudent && lessons.length > 3 && (
          <div style={{ marginTop: 12 }}>
            <Link to="/lessons"><button className="btn btn-outline">Zobacz wszystkie lekcje →</button></Link>
          </div>
        )}
      </section>
    </div>
  )
}
