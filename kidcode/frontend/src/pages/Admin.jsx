import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

// ensure only admin can access this page

export default function Admin(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({ title: '', difficulty: 'Łatwy', durationMin: 10, language: 'javascript', content: '', starterCode: '' })

  useEffect(()=>{
    try {
      const userStr = localStorage.getItem('kidcode_user')
      const user = userStr ? JSON.parse(userStr) : null
      console.log('Admin check:', user)
      if (!user || !user.isAdmin) {
        console.log('Not admin, redirecting')
        navigate('/login')
        return
      }
      setChecking(false)
    } catch(e) {
      console.error('Admin check error:', e)
      navigate('/login')
    }
  },[]) 

  useEffect(()=>{
    if (id){
      setLoading(true)
      api.get(`/lessons/${id}`).then(r => {
        const l = r.data.lesson
        setForm({ 
          title: l.title || '', 
          difficulty: l.difficulty || 'Łatwy', 
          durationMin: l.durationMin || 10, 
          language: l.language || 'javascript',
          content: l.content || '', 
          starterCode: l.starterCode || '' 
        })
      }).catch(()=>{}).finally(()=>setLoading(false))
    }
  },[id])

  function handleChange(e){
    const { name, value } = e.target
    setForm(s => ({ ...s, [name]: name === 'durationMin' ? Number(value) : value }))
  }

  function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    const payload = { 
      title: form.title, 
      difficulty: form.difficulty, 
      durationMin: form.durationMin, 
      language: form.language,
      content: form.content, 
      starterCode: form.starterCode 
    }
    const req = id ? api.put(`/lessons/${id}`, payload) : api.post('/lessons', payload)
    req.then(()=> {
      navigate('/lessons')
    }).catch(err => {
      alert('Błąd zapisu: ' + (err?.response?.data?.error || err.message))
    }).finally(()=> setLoading(false))
  }

  if (checking) {
    return <div>Sprawdzanie uprawnień...</div>
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{id ? 'Edycja lekcji' : 'Nowa lekcja'}</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 900 }}>
        <div className="form-row">
          <label> Tytuł</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="form-row" style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label> Poziom</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option>Łatwy</option>
              <option>Średni</option>
              <option>Trudny</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label> Język programowania</label>
            <select name="language" value={form.language} onChange={handleChange}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div style={{ width: 140 }}>
            <label> Czas (min)</label>
            <input name="durationMin" type="number" min={1} value={form.durationMin} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <label> Treść lekcji (HTML)</label>
          <textarea name="content" value={form.content} onChange={handleChange} style={{ height: 160 }} />
        </div>

        <div className="form-row">
          <label> Startowy kod ({form.language === 'python' ? 'Python' : 'JavaScript'})</label>
          <textarea 
            name="starterCode" 
            value={form.starterCode} 
            onChange={handleChange} 
            style={{ 
              height: 140, 
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 13
            }} 
            placeholder={form.language === 'python' ? '# Wprowadź kod Python' : '// Wprowadź kod JavaScript'}
          />
        </div>

        <p>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Zapis...' : 'Zapisz'}</button>
          <Link to="/" style={{ marginLeft: 12 }}><button className="btn btn-ghost" type="button">Anuluj</button></Link>
        </p>
      </form>
    </div>
  )
}
