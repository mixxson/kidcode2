import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { executeJS } from '../services/jsExecutor'
import { executePython, preloadPyodide } from '../services/pythonExecutor'

export default function Editor(){
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [code, setCode] = useState('# Ładowanie...')
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [language, setLanguage] = useState('javascript')

  // Загрузка урока и сохраненного кода
  useEffect(()=>{
    api.get(`/lessons/${id}`)
      .then(r => {
        setLesson(r.data.lesson)
        const lessonLanguage = r.data.lesson.language || 'javascript'
        setLanguage(lessonLanguage)
        
        const starterCode = r.data.lesson.starterCode || (lessonLanguage === 'python' ? '# Wprowadź swój kod' : '// Wprowadź swój kod')
        
        // Проверяем, есть ли сохраненный код для этого урока
        const savedCode = localStorage.getItem(`lesson_code_${id}`)
        setCode(savedCode || starterCode)

        // Preload Pyodide if Python lesson
        if (lessonLanguage === 'python') {
          preloadPyodide().catch(err => console.error('Failed to preload Pyodide:', err))
        }
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

  async function runCode(){
    if (isRunning) return
    
    setIsRunning(true)
    setOutput('⏳ Wykonywanie...')

    try {
      if (language === 'python') {
        const result = await executePython(code)
        if (result.error) {
          setOutput(`❌ Błąd:\n${result.error}`)
        } else {
          setOutput(result.output || '(brak wyniku)')
        }
      } else {
        // JavaScript
        const result = await executeJS(code)
        if (result.error) {
          setOutput(`❌ Błąd:\n${result.error}`)
        } else {
          setOutput(result.output || '(brak wyniku)')
        }
      }
    } catch (error) {
      setOutput(`❌ Nieoczekiwany błąd:\n${error.message || error.toString()}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Link to={`/lessons/${id}`} className="small" style={{ color: '#6b7280', textDecoration: 'none' }}>
          ← Powrót do lekcji
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>
            {lesson ? lesson.title : `Edytor lekcji #${id}`}
          </h2>
          {lesson && (
            <p className="small" style={{ marginBottom: 0, color: '#6b7280' }}>
              {lesson.difficulty} • {lesson.durationMin} min
            </p>
          )}
        </div>
        <div style={{ 
          padding: '6px 12px', 
          borderRadius: 8, 
          background: language === 'python' ? '#3776ab20' : '#f7df1e20',
          color: language === 'python' ? '#3776ab' : '#f0db4f',
          fontWeight: 600,
          fontSize: 13,
          border: `2px solid ${language === 'python' ? '#3776ab' : '#f0db4f'}`
        }}>
          {language === 'python' ? '🐍 Python' : '📜 JavaScript'}
        </div>
      </div>

      <div className="editor-wrap">
        <div className="editor-area">
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="small" style={{ color: '#10b981' }}>💾 Kod zapisywany automatycznie</span>
            <button className="btn btn-ghost" onClick={resetCode} style={{ fontSize: 12, padding: '4px 8px' }}>
              🔄 Resetuj do początku
            </button>
          </div>
          <textarea 
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
            <button 
              className="btn btn-primary" 
              onClick={runCode}
              disabled={isRunning}
              style={{ opacity: isRunning ? 0.6 : 1, cursor: isRunning ? 'not-allowed' : 'pointer' }}
            >
              {isRunning ? '⏳ Wykonywanie...' : '▶️ Uruchom kod'}
            </button>
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
            fontSize: 13,
            color: output.startsWith('❌') ? '#ef4444' : '#1f2937'
          }}>
            {output || 'Uruchom kod, aby zobaczyć wynik...'}
          </pre>
        </div>
      </div>
    </div>
  )
}
