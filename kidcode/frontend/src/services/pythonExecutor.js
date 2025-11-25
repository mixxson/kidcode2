// Python Code Executor using Pyodide (WASM)
let pyodideInstance = null
let loadingPromise = null

/**
 * Load Pyodide runtime from CDN (lazy loading)
 * @returns {Promise<Object>} Pyodide instance
 */
async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      // Load Pyodide from CDN
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js'
      
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = () => reject(new Error('Failed to load Pyodide script'))
        document.head.appendChild(script)
      })
      
      // Wait for global loadPyodide to be available
      if (!window.loadPyodide) {
        throw new Error('loadPyodide is not available')
      }
      
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
      })
      
      console.log('✅ Pyodide loaded successfully')
      return pyodideInstance
    } catch (error) {
      console.error('❌ Failed to load Pyodide:', error)
      loadingPromise = null // Reset so it can be retried
      throw error
    }
  })()

  return loadingPromise
}

/**
 * Execute Python code
 * @param {string} code - Python code to execute
 * @returns {Promise<{output: string, error: string|null}>}
 */
export async function executePython(code) {
  try {
    const pyodide = await loadPyodide()

    // Capture stdout/stderr
    await pyodide.runPythonAsync(`
import sys
from io import StringIO

# Create string buffers for stdout and stderr
sys.stdout = StringIO()
sys.stderr = StringIO()
`)

    // Run user code
    let result
    try {
      result = await pyodide.runPythonAsync(code)
    } catch (execError) {
      // Get stderr if there was an error
      const stderr = await pyodide.runPythonAsync('sys.stderr.getvalue()')
      
      // Reset stdout/stderr
      await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)
      
      return {
        output: '',
        error: stderr || execError.toString()
      }
    }

    // Get captured output
    const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()')
    const stderr = await pyodide.runPythonAsync('sys.stderr.getvalue()')

    // Reset stdout/stderr
    await pyodide.runPythonAsync(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`)

    // Combine output
    let output = stdout

    // If there's a result and no print output, show the result
    if (result !== undefined && result !== null && !stdout) {
      output = String(result)
    }

    return {
      output: output || '(brak wyniku)',
      error: stderr || null
    }
  } catch (error) {
    return {
      output: '',
      error: `Błąd ładowania Python:\n${error.message || error.toString()}`
    }
  }
}

/**
 * Check if Pyodide is loaded
 * @returns {boolean}
 */
export function isPyodideLoaded() {
  return pyodideInstance !== null
}

/**
 * Preload Pyodide (call this when entering a Python room)
 * @returns {Promise<void>}
 */
export async function preloadPyodide() {
  await loadPyodide()
}
