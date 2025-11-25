import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const r = await api.post('/auth/login', { email, password })
      localStorage.setItem('kidcode_token', r.data.token)
      localStorage.setItem('kidcode_user', JSON.stringify(r.data.user))
      navigate('/')
    }catch(err){
      alert('Błąd logowania: ' + (err?.response?.data?.error || err.message))
    }finally{ setLoading(false) }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Logowanie</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <div className="form-row">
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div className="form-row">
          <label>Hasło</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <p>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Logowanie...' : 'Zaloguj'}</button>
          <Link to="/register" style={{ marginLeft: 12 }}><button className="btn btn-ghost" type="button">Rejestracja</button></Link>
        </p>
      </form>
    </div>
  )
}
