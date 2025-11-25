// JS Executor using Web Worker for sandbox isolation
let worker = null

export function executeJS(code, timeout = 5000){
  return new Promise((resolve, reject) => {
    if (worker) worker.terminate()
    
    const workerCode = `
      const logs = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map(a => String(a)).join(' '))
      }
      
      self.onmessage = function(e){
        try {
          eval(e.data)
          self.postMessage({ type: 'success', logs })
        } catch(err) {
          self.postMessage({ type: 'error', message: err.message, logs })
        }
      }
    `
    
    const blob = new Blob([workerCode], { type: 'application/javascript' })
    worker = new Worker(URL.createObjectURL(blob))
    
    const timer = setTimeout(() => {
      worker.terminate()
      reject(new Error('Timeout: execution exceeded ' + (timeout/1000) + 's'))
    }, timeout)
    
    worker.onmessage = (e) => {
      clearTimeout(timer)
      worker.terminate()
      if (e.data.type === 'error'){
        reject(new Error(e.data.message))
      } else {
        resolve({ output: e.data.logs || [] })
      }
    }
    
    worker.onerror = (err) => {
      clearTimeout(timer)
      worker.terminate()
      reject(err)
    }
    
    worker.postMessage(code)
  })
}
