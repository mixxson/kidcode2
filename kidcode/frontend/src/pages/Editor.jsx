import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function Editor(){
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [starter, setStarter] = useState('// Ładowanie...')
  const iframeRef = useRef(null)
  const [output, setOutput] = useState('')

  useEffect(()=>{
    api.get(`/lessons/${id}`)
      .then(r => {
        setLesson(r.data.lesson)
        setStarter(r.data.lesson.starterCode || '')
      })
      .catch((err)=> {
        console.error('Error loading lesson:', err)
        setStarter('')
      })
  },[id])

  useEffect(()=>{
    function onMsg(e){
      if (e.data && e.data.type === 'result') setOutput(String(e.data.payload))
    }
    window.addEventListener('message', onMsg)
    return ()=> window.removeEventListener('message', onMsg)
  },[])

  function runCode(){
    const code = document.getElementById('codeArea').value
    const iframe = iframeRef.current
    if (!iframe) return
    iframe.contentWindow.postMessage({ type: 'run', code }, '*')
  }

  const iframeSrc = `<!doctype html><html><body><script>window.addEventListener('message', e=>{ if(e.data && e.data.type==='run'){ try{ const res = (function(){\n"use strict";\nreturn eval(e.data.code)\n})(); parent.postMessage({type:'result', payload:String(res)}, '*') }catch(err){ parent.postMessage({type:'result', payload:err.toString()}, '*') } } })</script></body></html>`

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to={`/lessons/${id}`} className="small" style={{ color: '#6b7280', textDecoration: 'none' }}>
          ← Powrót do lekcji
        </Link>
      </div>

      <h2 style={{ marginTop: 0, marginBottom: 8 }}>
        {lesson ? lesson.title : `Edytor lekcji #${id}`}
      </h2>
      {lesson && (
        <p className="small" style={{ marginBottom: 16, color: '#6b7280' }}>
          {lesson.difficulty} • {lesson.durationMin} min
        </p>
      )}

      <div className="editor-wrap">
        <div className="editor-area">
          <textarea 
            id="codeArea" 
            defaultValue={starter} 
            style={{ 
              width: '100%', 
              height: 400, 
              borderRadius: 8, 
              border: '1px solid var(--border)', 
              padding: 12,
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 14,
              lineHeight: 1.5
            }} 
          />
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={runCode}>▶️ Uruchom kod</button>
            <Link to={`/lessons/${id}`}><button className="btn btn-ghost">Powrót</button></Link>
          </div>
        </div>
        <div className="result-box">
          <h4 style={{ marginTop: 0 }}>Wynik:</h4>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            background: '#f9fafb', 
            padding: 12, 
            borderRadius: 8,
            minHeight: 100,
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: 13
          }}>
            {output || 'Uruchom kod, aby zobaczyć wynik...'}
          </pre>
        </div>
      </div>
      <iframe ref={iframeRef} title="sandbox" sandbox="allow-scripts" srcDoc={iframeSrc} style={{ display: 'none' }} />
    </div>
  )
}
