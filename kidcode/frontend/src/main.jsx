import React from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Toaster } from '@chakra-ui/react'
import App from './App'
import { toaster } from './components/toaster'
import './styles/index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <App />
      <Toaster toaster={toaster} />
    </ChakraProvider>
  </React.StrictMode>
)
