import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, HStack, Button, Text, Spacer, Badge } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { connectSocket, joinRoom, leaveRoom, onRemoteCodeUpdate, sendCodeUpdate } from '../services/socketService'
import { executeJS } from '../services/jsExecutor'
import OutputPanel from '../components/OutputPanel'

export default function CodeRoom(){
  const { id } = useParams()
  const roomId = Number(id)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Zacznij pisać kod...')
  const [connected, setConnected] = useState(false)
  const [output, setOutput] = useState([])
  const [error, setError] = useState(null)
  const [running, setRunning] = useState(false)
  const versionRef = useRef(0)
  const originRef = useRef('local')

  useEffect(()=>{
    const s = connectSocket()
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)

    joinRoom(roomId)

    const off = onRemoteCodeUpdate(({ code: remoteCode, version }) => {
      // Ignore if remote version is not newer
      if (typeof version === 'number' && version <= versionRef.current) return
      originRef.current = 'remote'
      setCode(remoteCode)
      versionRef.current = version || (versionRef.current + 1)
      originRef.current = 'local'
    })

    return () => {
      off && off()
      leaveRoom(roomId)
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
    }
  }, [roomId])

  function handleChange(value){
    setCode(value)
    // bump version and send
    versionRef.current = versionRef.current + 1
    sendCodeUpdate(roomId, value, versionRef.current)
  }

  async function runCode(){
    setOutput([])
    setError(null)
    setRunning(true)
    
    if (language === 'javascript'){
      try {
        const result = await executeJS(code)
        setOutput(result.output || [])
      } catch(err){
        setError(err.message)
      } finally {
        setRunning(false)
      }
    } else {
      // Python - TODO: integrate Pyodide
      setError('Python execution not yet implemented. Coming soon!')
      setRunning(false)
    }
  }

  return (
    <Flex direction="column" height="calc(100vh - 100px)">
      <HStack p={3} borderBottom="1px" borderColor="gray.200" gap={3}>
        <Heading size="md">Pokój #{roomId}</Heading>
        <Badge colorPalette={connected ? 'green' : 'red'}>
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
        <Spacer />
        <Text fontSize="sm" color="gray.500">Język:</Text>
        <select style={{padding:'4px 8px', borderRadius:'4px', border:'1px solid #ccc'}} value={language} onChange={(e)=>setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
        <Button size="sm" colorPalette="blue" onClick={runCode} loading={running}>
          {running ? 'Uruchamianie...' : 'Uruchom'}
        </Button>
      </HStack>

      <Flex flex="1 1 auto" overflow="hidden">
        <Box flex="1 1 60%" minW="0">
          <Editor
            height="100%"
            defaultLanguage={language === 'python' ? 'python' : 'javascript'}
            language={language === 'python' ? 'python' : 'javascript'}
            value={code}
            onChange={handleChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
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
