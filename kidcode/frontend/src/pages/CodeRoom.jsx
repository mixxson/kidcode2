import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, HStack, Button, Text, Spacer, Badge } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { useSocket } from '../context/SocketContext'
import { executeJS } from '../services/jsExecutor'
import { executePython } from '../services/pythonExecutor'
import OutputPanel from '../components/OutputPanel'

export default function CodeRoom(){
  const { id } = useParams()
  const roomId = Number(id)
  const { isConnected, joinRoom, leaveRoom, sendCodeUpdate, onCodeUpdate } = useSocket()
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Zacznij pisać kod...')
  const [output, setOutput] = useState([])
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)
  const isRemoteUpdate = useRef(false)

  useEffect(()=>{
    // Join room when connected
    if (isConnected) {
      joinRoom(roomId, (response) => {
        if (response?.error) {
          setError(response.error)
        } else if (response?.room) {
          // Load room data
          setLanguage(response.room.language || 'javascript')
          setCode(response.room.code || (response.room.language === 'python' ? '# Zacznij pisać kod...' : '// Zacznij pisać kod...'))
        }
      })
    }

    // Listen for code updates from other users
    const cleanup = onCodeUpdate(({ code: remoteCode, language: remoteLang }) => {
      if (isRemoteUpdate.current) return // Skip if this is our own update
      
      isRemoteUpdate.current = true
      setCode(remoteCode)
      if (remoteLang) setLanguage(remoteLang)
      
      // Reset flag after a small delay
      setTimeout(() => {
        isRemoteUpdate.current = false
      }, 100)
    })

    return () => {
      leaveRoom(roomId)
      if (cleanup) cleanup()
    }
  }, [roomId, isConnected, joinRoom, leaveRoom, onCodeUpdate])

  function handleChange(value){
    if (isRemoteUpdate.current) return // Don't send updates that came from remote
    
    setCode(value)
    sendCodeUpdate(roomId, value, language)
  }

  async function runCode(){
    setOutput([])
    setError(null)
    setRunning(true)
    
    try {
      if (language === 'python') {
        const result = await executePython(code)
        if (result.error) {
          setError(result.error)
        } else {
          setOutput([result.output])
        }
      } else {
        // JavaScript
        const result = await executeJS(code)
        if (result.error) {
          setError(result.error)
        } else {
          setOutput(Array.isArray(result.output) ? result.output : [result.output])
        }
      }
    } catch(err) {
      setError(err.message || err.toString())
    } finally {
      setRunning(false)
    }
  }

  function handleLanguageChange(newLang) {
    setLanguage(newLang)
    // Update room language via socket
    sendCodeUpdate(roomId, code, newLang)
  }

  return (
    <Flex direction="column" height="calc(100vh - 100px)">
      <HStack p={3} borderBottom="1px" borderColor="gray.200" gap={3} flexWrap="wrap">
        <Heading size="md">Pokój #{roomId}</Heading>
        <Badge colorPalette={isConnected ? 'green' : 'red'} fontSize="xs">
          {isConnected ? '🟢 Połączony' : '🔴 Rozłączony'}
        </Badge>
        <Spacer />
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.500">Język:</Text>
          <HStack gap={1}>
            <Button 
              size="sm" 
              variant={language === 'javascript' ? 'solid' : 'outline'}
              colorPalette={language === 'javascript' ? 'yellow' : 'gray'}
              onClick={() => handleLanguageChange('javascript')}
            >
              📜 JS
            </Button>
            <Button 
              size="sm" 
              variant={language === 'python' ? 'solid' : 'outline'}
              colorPalette={language === 'python' ? 'blue' : 'gray'}
              onClick={() => handleLanguageChange('python')}
            >
              🐍 Python
            </Button>
          </HStack>
        </HStack>
        <Button size="sm" colorPalette="green" onClick={runCode} loading={running} disabled={!isConnected}>
          {running ? '⏳ Uruchamianie...' : '▶️ Uruchom kod'}
        </Button>
      </HStack>

      <Flex flex="1 1 auto" overflow="hidden">
        <Box flex="1 1 60%" minW="0" borderRight="1px" borderColor="gray.200">
          <Editor
            height="100%"
            language={language === 'python' ? 'python' : 'javascript'}
            value={code}
            onChange={handleChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              tabSize: language === 'python' ? 4 : 2,
              readOnly: !isConnected
            }}
          />
        </Box>
        <Box flex="1 1 40%" minW="0">
          <OutputPanel output={output} error={error} />
        </Box>
      </Flex>
    </Flex>
  )
}
