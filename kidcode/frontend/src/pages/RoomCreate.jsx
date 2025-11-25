import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Button, VStack, Input, Select as ChakraSelect, Text } from '@chakra-ui/react'
import api from '../services/api'

export default function RoomCreate(){
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    // Load all users to select student
    api.get('/auth/me').then(()=>{
      // For now, just allow manual ID input
      // In production, fetch list of students
    }).catch(()=>{})
  }, [])

  async function handleSubmit(e){
    e.preventDefault()
    if (!name || !studentId) return alert('Wypełnij wszystkie pola')
    setLoading(true)
    try{
      const r = await api.post('/rooms', { 
        name, 
        studentId: Number(studentId), 
        language,
        code: language === 'python' ? '# Zacznij pisać kod...' : '// Zacznij pisać kod...'
      })
      alert('Pokój utworzony!')
      navigate('/rooms')
    }catch(err){
      alert('Błąd: ' + (err?.response?.data?.error || err.message))
    }finally{ setLoading(false) }
  }

  return (
    <Box p={6} maxW="600px">
      <Heading size="lg" mb={6}>Utwórz nowy pokój</Heading>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" gap={4}>
          <Box>
            <Text mb={1} fontWeight="bold">Nazwa pokoju:</Text>
            <Input 
              placeholder="np. Pokój Ucznia Jan - Lekcja 1" 
              value={name} 
              onChange={e=>setName(e.target.value)}
              required
            />
          </Box>
          
          <Box>
            <Text mb={1} fontWeight="bold">ID Ucznia:</Text>
            <Input 
              type="number"
              placeholder="np. 3" 
              value={studentId} 
              onChange={e=>setStudentId(e.target.value)}
              required
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Wpisz ID użytkownika-ucznia (znajdziesz w bazie users.json)
            </Text>
          </Box>

          <Box>
            <Text mb={1} fontWeight="bold">Język programowania:</Text>
            <select 
              style={{width:'100%', padding:'8px 12px', borderRadius:'6px', border:'1px solid #ccc'}}
              value={language} 
              onChange={e=>setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
          </Box>

          <Button type="submit" colorPalette="green" loading={loading} mt={2}>
            {loading ? 'Tworzenie...' : 'Utwórz pokój'}
          </Button>
          <Button variant="outline" onClick={()=>navigate('/rooms')}>
            Anuluj
          </Button>
        </VStack>
      </form>
    </Box>
  )
}
