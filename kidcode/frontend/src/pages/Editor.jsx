import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function Editor(){
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [code, setCode] = useState('// Ładowanie...')
  const iframeRef = useRef(null)
  const [output, setOutput] = useState('')
  const codeAreaRef = useRef(null)

  // Загрузка урока и сохраненного кода
  useEffect(()=>{
    api.get(`/lessons/${id}`)
      .then(r => {
        setLesson(r.data.lesson)
        const starterCode = r.data.lesson.starterCode || ''
        
        // Проверяем, есть ли сохраненный код для этого урока
        const savedCode = localStorage.getItem(`lesson_code_${id}`)
        setCode(savedCode || starterCode)
      })
      .catch((err)=> {
        console.error('Error loading lesson:', err)
        setCode('')
      })
  },[id])

  // Автосохранение кода при изменении
  const handleCodeChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    localStorage.setItem(`lesson_code_${id}`, newCode)
  }

  // Сброс к начальному коду
  const resetCode = () => {
    if (!lesson) return
    if (confirm('Czy na pewno chcesz zresetować kod do początkowego stanu?')) {
      const starterCode = lesson.starterCode || ''
      setCode(starterCode)
      localStorage.setItem(`lesson_code_${id}`, starterCode)
    }
  }

  useEffect(()=>{
    function onMsg(e){
      if (e.data && e.data.type === 'result') {
        setOutput(e.data.payload)
      }
    }
    window.addEventListener('message', onMsg)
    return ()=> window.removeEventListener('message', onMsg)
  },[])

  function runCode(){
    const iframe = iframeRef.current
    if (!iframe) return
    setOutput('Wykonywanie...')
    iframe.contentWindow.postMessage({ type: 'run', code }, '*')
  }

  const iframeSrc = `<!doctype html><html><body><script>
    window.addEventListener('message', e => {
      if(e.data && e.data.type === 'run') {
        const logs = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = (...args) => {
          logs.push(args.map(a => String(a)).join(' '));
        };
        console.error = (...args) => {
          logs.push('ERROR: ' + args.map(a => String(a)).join(' '));
        };
        console.warn = (...args) => {
          logs.push('WARNING: ' + args.map(a => String(a)).join(' '));
        };
        
        try {
          const result = (function() {
            "use strict";
            return eval(e.data.code);
          })();
          
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
          
          let output = logs.join('\\n');
          if (result !== undefined && logs.length === 0) {
            output = String(result);
          }
          
          parent.postMessage({type:'result', payload: output || '(brak wyniku)'}, '*');
        } catch(err) {
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
          
          parent.postMessage({type:'result', payload: '❌ Błąd:\\n' + err.toString()}, '*');
        }
      }
    });
  </script></body></html>`

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
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="small" style={{ color: '#10b981' }}>💾 Kod zapisywany automatycznie</span>
            <button className="btn btn-ghost" onClick={resetCode} style={{ fontSize: 12, padding: '4px 8px' }}>
              🔄 Resetuj do początku
            </button>
          </div>
          <textarea 
            ref={codeAreaRef}
            id="codeArea" 
            value={code}
            onChange={handleCodeChange}
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
