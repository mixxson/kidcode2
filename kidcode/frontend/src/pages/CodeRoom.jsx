import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Flex, Heading, HStack, Button, Select, Text, Spacer, Badge } from '@chakra-ui/react'
import Editor from '@monaco-editor/react'
import { connectSocket, joinRoom, leaveRoom, onRemoteCodeUpdate, sendCodeUpdate } from '../services/socketService'

export default function CodeRoom(){
  const { id } = useParams()
  const roomId = Number(id)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState('// Zacznij pisać kod...')
  const [connected, setConnected] = useState(false)
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

  return (
    <Flex direction="column" height="calc(100vh - 100px)">
      <HStack p={3} borderBottom="1px" borderColor="gray.200" spacing={3}>
        <Heading size="md">Pokój #{roomId}</Heading>
        <Badge colorScheme={connected ? 'green' : 'red'}>
          {connected ? 'Connected' : 'Disconnected'}
        </Badge>
        <Spacer />
        <Text fontSize="sm" color="gray.500">Język:</Text>
        <Select size="sm" width="200px" value={language} onChange={(e)=>setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </Select>
        <Button size="sm" colorScheme="blue">Uruchom</Button>
      </HStack>

      <Box flex="1 1 auto">
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
    </Flex>
  )
}
