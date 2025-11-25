// JS Executor using Web Worker for sandbox isolation
let worker = null

export function executeJS(code, timeout = 5000){
  return new Promise((resolve) => {
    if (worker) worker.terminate()
    
    const workerCode = `
      const logs = []
      const originalLog = console.log
      const originalError = console.error
      const originalWarn = console.warn
      
      console.log = (...args) => {
        logs.push(args.map(a => String(a)).join(' '))
      }
      console.error = (...args) => {
        logs.push('ERROR: ' + args.map(a => String(a)).join(' '))
      }
      console.warn = (...args) => {
        logs.push('WARNING: ' + args.map(a => String(a)).join(' '))
      }
      
      self.onmessage = function(e){
        try {
          const result = eval(e.data)
          self.postMessage({ type: 'success', logs, result })
        } catch(err) {
          self.postMessage({ type: 'error', message: err.toString(), logs })
        }
      }
    `
    
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    worker = new Worker(URL.createObjectURL(blob))
    
    const timer = setTimeout(() => {
      worker.terminate()
      resolve({ output: '', error: 'Timeout: wykonanie przekroczyło ' + (timeout/1000) + 's' })
    }, timeout)
    
    worker.onmessage = (e) => {
      clearTimeout(timer)
      worker.terminate()
      
      if (e.data.type === 'error'){
        const output = e.data.logs && e.data.logs.length > 0 ? e.data.logs.join('\n') + '\n' : ''
        resolve({ output, error: e.data.message })
      } else {
        let output = e.data.logs && e.data.logs.length > 0 ? e.data.logs.join('\n') : ''
        // If no logs but there's a result, show it
        if (!output && e.data.result !== undefined) {
          output = String(e.data.result)
        }
        resolve({ output: output || '(brak wyniku)', error: null })
      }
    }
    
    worker.onerror = (err) => {
      clearTimeout(timer)
      worker.terminate()
      resolve({ output: '', error: err.message || err.toString() })
    }
    
    worker.postMessage(code)
  })
}
