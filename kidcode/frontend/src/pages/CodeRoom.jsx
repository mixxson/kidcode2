import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, HStack, Button, Text, Spacer, Tabs } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { useSocket } from '../context/SocketContext'
import { executeJS } from '../services/jsExecutor'
import { executePython } from '../services/pythonExecutor'
import OutputPanel from '../components/OutputPanel'
import SyncStatus from '../components/SyncStatus'

export default function CodeRoom(){
  const { id } = useParams()
  const roomId = Number(id)
  const { isConnected, joinRoom, leaveRoom, sendCodeUpdate, onCodeUpdate } = useSocket()
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Zacznij pisać kod...')
  const [output, setOutput] = useState([])
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)
  const [mobileTab, setMobileTab] = useState('editor') // 'editor' or 'output'
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
      
      // Reset flag after longer delay to avoid conflicts during typing
      setTimeout(() => {
        isRemoteUpdate.current = false
      }, 600) // Match debounce + buffer
    })

    return () => {
      leaveRoom(roomId)
      if (cleanup) cleanup()
    }
  }, [roomId, isConnected, joinRoom, leaveRoom, onCodeUpdate])

  function handleChange(value){
    if (isRemoteUpdate.current) return // Don't send updates that came from remote
    
    setCode(value)
    
    // Always allow local editing, even if temporarily disconnected
    // The debounced update will be sent when connection is restored
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
    if (newLang === language) return // Already this language
    
    // Reset code to default for new language
    const newCode = newLang === 'python' ? '# Zacznij pisać kod...\nprint("Hello, Python!")' : '// Zacznij pisać kod...\nconsole.log("Hello, JavaScript!")'
    
    setLanguage(newLang)
    setCode(newCode)
    setOutput([])
    setError(null)
    
    // Update room language and code via socket
    sendCodeUpdate(roomId, newCode, newLang)
  }

  return (
    <>
      <SyncStatus />
      <Flex direction="column" height="calc(100vh - 70px)">
        {/* Header */}
        <HStack p={3} borderBottom="1px" borderColor="gray.200" gap={3} flexWrap="wrap" bg="white">
          <Heading size={{ base: 'sm', md: 'md' }}>Pokój #{roomId}</Heading>
          <Spacer display={{ base: 'none', md: 'block' }} />
          
          <HStack gap={2} flexWrap="wrap">
            <Text fontSize="sm" color="gray.500" display={{ base: 'none', sm: 'block' }}>Język:</Text>
            <HStack gap={1}>
              <Button 
                size={{ base: 'xs', md: 'sm' }}
                variant={language === 'javascript' ? 'solid' : 'outline'}
                colorPalette={language === 'javascript' ? 'yellow' : 'gray'}
                onClick={() => handleLanguageChange('javascript')}
              >
                📜 JS
              </Button>
              <Button 
                size={{ base: 'xs', md: 'sm' }}
                variant={language === 'python' ? 'solid' : 'outline'}
                colorPalette={language === 'python' ? 'blue' : 'gray'}
                onClick={() => handleLanguageChange('python')}
              >
                🐍 Python
              </Button>
            </HStack>
          </HStack>
          
          <Button 
            size={{ base: 'xs', md: 'sm' }}
            colorPalette="green" 
            onClick={runCode} 
            loading={running} 
            disabled={!isConnected}
          >
            {running ? '⏳' : '▶️'} {running ? 'Uruchamianie...' : 'Uruchom'}
          </Button>
        </HStack>

        {/* Mobile: Tabs view */}
        <Box display={{ base: 'block', lg: 'none' }} flex="1" overflow="hidden">
          <HStack gap={0} borderBottom="2px" borderColor="gray.200" bg="gray.50">
            <Button
              flex="1"
              variant="ghost"
              borderRadius="0"
              borderBottom={mobileTab === 'editor' ? '2px' : 'none'}
              borderColor="blue.500"
              colorPalette={mobileTab === 'editor' ? 'blue' : 'gray'}
              onClick={() => setMobileTab('editor')}
              size="sm"
            >
              📝 Edytor
            </Button>
            <Button
              flex="1"
              variant="ghost"
              borderRadius="0"
              borderBottom={mobileTab === 'output' ? '2px' : 'none'}
              borderColor="blue.500"
              colorPalette={mobileTab === 'output' ? 'blue' : 'gray'}
              onClick={() => setMobileTab('output')}
              size="sm"
            >
              📤 Wynik
            </Button>
          </HStack>
          
          {mobileTab === 'editor' ? (
            <Box height="calc(100vh - 160px)">
              <Editor
                height="100%"
                language={language === 'python' ? 'python' : 'javascript'}
                value={code}
                onChange={handleChange}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  tabSize: language === 'python' ? 4 : 2,
                  readOnly: false
                }}
              />
            </Box>
          ) : (
            <Box height="calc(100vh - 160px)" overflow="auto">
              <OutputPanel output={output} error={error} />
            </Box>
          )}
        </Box>

        {/* Desktop: Split view */}
        <Flex flex="1 1 auto" overflow="hidden" display={{ base: 'none', lg: 'flex' }}>
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
                readOnly: false
              }}
            />
          </Box>
          <Box flex="1 1 40%" minW="0">
            <OutputPanel output={output} error={error} />
          </Box>
        </Flex>
      </Flex>
    </>
  )
}
