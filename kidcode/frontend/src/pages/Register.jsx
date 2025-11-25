import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [adminKey, setAdminKey] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const r = await api.post('/auth/register', { email, password, adminKey })
      localStorage.setItem('kidcode_token', r.data.token)
      localStorage.setItem('kidcode_user', JSON.stringify(r.data.user))
      navigate('/')
    }catch(err){
      alert('Błąd rejestracji: ' + (err?.response?.data?.error || err.message))
    }finally{ setLoading(false) }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Rejestracja</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="form-row">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Hasło</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Klucz administratora (opcjonalnie)</label>
          <input value={adminKey} onChange={e=>setAdminKey(e.target.value)} placeholder="jeśli chcesz być adminem" />
        </div>
        <p>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Rejestracja...' : 'Zarejestruj się'}</button>
          <Link to="/login" style={{ marginLeft: 12 }}><button className="btn btn-ghost" type="button">Mam już konto</button></Link>
        </p>
      </form>
    </div>
  )
}
