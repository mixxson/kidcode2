import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, VStack, Text, Input, Button } from '@chakra-ui/react'
import api from '../services/api'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student') // Default to student
  const [adminKey, setAdminKey] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Check if already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('kidcode_token')
    const userStr = localStorage.getItem('kidcode_user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        console.log('Already logged in! User:', user)
        const redirectUrl = (user.isAdmin === true || user.role === 'teacher' || user.role === 'admin') 
          ? '/dashboard' 
          : '/'
        console.log('Redirecting logged-in user to:', redirectUrl)
        window.location.href = redirectUrl
      } catch(e) {
        console.error('Error checking login status:', e)
      }
    }
  }, [])

  async function handleSubmit(e){
    e.preventDefault()
    if (loading) return
    
    setLoading(true)
    console.log('Starting registration...')
    
    try{
      const r = await api.post('/auth/register', { email, password, adminKey, role })
      console.log('Registration response:', r.data)
      
      localStorage.setItem('kidcode_token', r.data.token)
      localStorage.setItem('kidcode_user', JSON.stringify(r.data.user))
      
      const user = r.data.user
      console.log('✅ Registration successful! User:', user)
      console.log('Token saved:', localStorage.getItem('kidcode_token') ? 'YES' : 'NO')
      console.log('User saved:', localStorage.getItem('kidcode_user') ? 'YES' : 'NO')
      
      // Determine redirect URL
      const redirectUrl = (user.isAdmin === true || user.role === 'teacher' || user.role === 'admin') 
        ? '/dashboard' 
        : '/'
      
      console.log('🚀 Redirecting to:', redirectUrl)
      
      // IMMEDIATE redirect - no delays, no toasts
      window.location.href = redirectUrl
      
    }catch(err){
      console.error('❌ Registration error:', err)
      const errorMsg = err?.response?.data?.error || err.message
      alert('Błąd rejestracji: ' + errorMsg)
      setLoading(false)
    }
  }

  return (
    <Box maxW="500px" mx="auto" mt={8}>
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          📝 Rejestracja
        </Text>
        
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Email
              </Text>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Wprowadź email"
                required
                size="lg"
                disabled={loading}
              />
            </Box>
            
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Hasło
              </Text>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Wprowadź hasło"
                required
                size="lg"
                disabled={loading}
              />
            </Box>
            
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Typ konta
              </Text>
              <Box
                as="select"
                value={role}
                onChange={e => setRole(e.target.value)}
                size="lg"
                disabled={loading}
                p={2}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.300"
                width="100%"
                fontSize="md"
                _hover={{ borderColor: 'gray.400' }}
                _focus={{ borderColor: 'blue.500', outline: 'none' }}
              >
                <option value="student">👨‍🎓 Uczeń</option>
                <option value="teacher">👨‍🏫 Nauczyciel</option>
                <option value="admin">👑 Administrator</option>
              </Box>
              <Text fontSize="xs" color="gray.500" mt={1}>
                {role === 'student' && 'Dostęp do lekcji i pokojów'}
                {role === 'teacher' && 'Dostęp do dashboard nauczyciela + tworzenie pokojów'}
                {role === 'admin' && 'Pełny dostęp (wymaga klucza administratora)'}
              </Text>
            </Box>
            
            {(role === 'admin' || role === 'teacher') && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  Klucz administratora
                  {role === 'teacher' && (
                    <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                      (opcjonalnie dla nauczyciela)
                    </Text>
                  )}
                  {role === 'admin' && (
                    <Text as="span" fontSize="xs" color="red.500" ml={2}>
                      (wymagane dla admina)
                    </Text>
                  )}
                </Text>
                <Input
                  type="password"
                  value={adminKey}
                  onChange={e => setAdminKey(e.target.value)}
                  placeholder="Wprowadź klucz administratora"
                  size="lg"
                  disabled={loading}
                  required={role === 'admin'}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  {role === 'teacher' && 'Bez klucza zostaniesz zwykłym uczniem'}
                  {role === 'admin' && 'Klucz jest obowiązkowy dla roli administratora'}
                </Text>
              </Box>
            )}
            
            <VStack gap={2} mt={4} align="stretch">
              <Button
                type="submit"
                colorPalette="blue"
                size="lg"
                width="100%"
                disabled={loading}
              >
                {loading ? 'Rejestracja...' : 'Zarejestruj się'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                width="100%"
                onClick={() => navigate('/login')}
                type="button"
                disabled={loading}
              >
                Mam już konto
              </Button>
            </VStack>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}
