import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function Editor(){
  const { id } = useParams()
  const [starter, setStarter] = useState('// Ładowanie...')
  const iframeRef = useRef(null)
  const [output, setOutput] = useState('')

  useEffect(()=>{
    axios.get(`http://localhost:4000/api/lessons/${id}`)
      .then(r => setStarter(r.data.lesson.starterCode || ''))
      .catch(()=> setStarter(''))
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
    <div>
      <h2 style={{ marginTop: 0 }}>Edytor lekcji #{id}</h2>
      <div className="editor-wrap">
        <div className="editor-area">
          <textarea id="codeArea" defaultValue={starter} style={{ width: '100%', height: 300, borderRadius: 8, border: '1px solid var(--border)', padding: 10 }} />
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-primary" onClick={runCode}>Uruchom kod</button>
            <Link to={`/lessons/${id}`} style={{ marginLeft: 12 }}><button className="btn btn-ghost">Powrót</button></Link>
          </div>
        </div>
        <div className="result-box">
          <h4 style={{ marginTop: 0 }}>Wynik</h4>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
        </div>
      </div>
      <iframe ref={iframeRef} title="sandbox" sandbox="allow-scripts" srcDoc={iframeSrc} style={{ display: 'none' }} />
    </div>
  )
}
