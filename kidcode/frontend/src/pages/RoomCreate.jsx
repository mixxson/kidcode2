import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Heading, Button, VStack, Input, Select as ChakraSelect, Text } from '@chakra-ui/react'
import api from '../services/api'

export default function RoomCreate(){
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [loading, setLoading] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [students, setStudents] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    // Load list of students
    setLoadingStudents(true)
    api.get('/users/students')
      .then(r => {
        setStudents(r.data.students || [])
        // Auto-select first student if available
        if (r.data.students && r.data.students.length > 0) {
          setStudentId(String(r.data.students[0].id))
          // Auto-generate room name
          setName(`Pokój - ${r.data.students[0].email}`)
        }
      })
      .catch(err => {
        console.error('Failed to load students:', err)
        alert('Nie udało się załadować listy uczniów')
      })
      .finally(() => setLoadingStudents(false))
  }, [])

  // Update room name when student changes
  useEffect(() => {
    if (studentId && students.length > 0) {
      const student = students.find(s => s.id === Number(studentId))
      if (student) {
        setName(`Pokój - ${student.email}`)
      }
    }
  }, [studentId, students])

  async function handleSubmit(e){
    e.preventDefault()
    if (!name || !studentId) return alert('Wypełnij wszystkie pola')
    if (students.length === 0) return alert('Brak dostępnych uczniów')
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
            <Text mb={1} fontWeight="bold">Uczeń:</Text>
            {loadingStudents ? (
              <Text fontSize="sm" color="gray.500">Ładowanie uczniów...</Text>
            ) : students.length === 0 ? (
              <Text fontSize="sm" color="red.500">Brak uczniów w systemie. Najpierw zarejestruj uczniów.</Text>
            ) : (
              <select 
                style={{width:'100%', padding:'8px 12px', borderRadius:'6px', border:'1px solid #ccc'}}
                value={studentId} 
                onChange={e=>setStudentId(e.target.value)}
                required
              >
                <option value="">-- Wybierz ucznia --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.email} (ID: {s.id})
                  </option>
                ))}
              </select>
            )}
            <Text fontSize="xs" color="gray.500" mt={1}>
              Wybierz ucznia, dla którego tworzysz pokój
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

          <Button 
            type="submit" 
            colorPalette="green" 
            loading={loading} 
            disabled={loadingStudents || students.length === 0}
            mt={2}
          >
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
