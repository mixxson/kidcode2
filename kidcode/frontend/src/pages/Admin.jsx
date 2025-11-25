import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

// ensure only admin can access this page

export default function Admin(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: '', difficulty: 'Łatwy', durationMin: 10, content: '', starterCode: '' })

  useEffect(()=>{
    // check current user; if not admin, redirect to login
    api.get('/auth/me').then(r => {
      if (!r.data.user?.isAdmin) navigate('/login')
    }).catch(()=> {
      navigate('/login')
    })
  },[]) 

  useEffect(()=>{
    if (id){
      setLoading(true)
      api.get(`/lessons/${id}`).then(r => {
        const l = r.data.lesson
        setForm({ title: l.title || '', difficulty: l.difficulty || 'Łatwy', durationMin: l.durationMin || 10, content: l.content || '', starterCode: l.starterCode || '' })
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
    const payload = { title: form.title, difficulty: form.difficulty, durationMin: form.durationMin, content: form.content, starterCode: form.starterCode }
    const req = id ? api.put(`/lessons/${id}`, payload) : api.post('/lessons', payload)
    req.then(()=> {
      navigate('/')
    }).catch(err => {
      alert('Błąd zapisu: ' + (err?.response?.data?.error || err.message))
    }).finally(()=> setLoading(false))
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
          <label> Startowy kod (JS)</label>
          <textarea name="starterCode" value={form.starterCode} onChange={handleChange} style={{ height: 140 }} />
        </div>

        <p>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Zapis...' : 'Zapisz'}</button>
          <Link to="/" style={{ marginLeft: 12 }}><button className="btn btn-ghost" type="button">Anuluj</button></Link>
        </p>
      </form>
    </div>
  )
}
