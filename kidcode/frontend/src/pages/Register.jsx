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
  const [error, setError] = useState('')
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
    setError('')
    console.log('📝 Starting registration...')
    console.log('Email:', email)
    console.log('Password length:', password?.length)
    console.log('Role:', role)
    console.log('Admin key provided:', adminKey ? 'YES' : 'NO')
    
    try{
      console.log('📤 Sending request to /auth/register...')
      const r = await api.post('/auth/register', { email, password, adminKey, role })
      console.log('✅ Registration response:', r.data)
      
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
      console.error('❌ Registration error FULL:', err)
      console.error('❌ Error response:', err?.response)
      console.error('❌ Error data:', err?.response?.data)
      console.error('❌ Error message:', err?.message)
      
      const errorMsg = err?.response?.data?.error || err.message || 'Nieznany błąd'
      console.log('📝 Error message extracted:', errorMsg)
      
      // Translate common errors to Polish
      let displayError = errorMsg
      if (errorMsg.includes('User exists') || errorMsg.includes('already exists')) {
        displayError = '❌ Użytkownik z tym emailem już istnieje. Zaloguj się lub użyj innego emaila.'
      } else if (errorMsg.includes('Invalid admin key') || errorMsg.includes('admin key')) {
        displayError = '❌ Nieprawidłowy klucz administratora. Sprawdź klucz i spróbuj ponownie.'
      } else if (errorMsg.includes('Email and password required')) {
        displayError = '❌ Email i hasło są wymagane.'
      } else if (errorMsg.includes('Password') && errorMsg.includes('short')) {
        displayError = '❌ Hasło jest za krótkie. Użyj minimum 6 znaków.'
      } else if (errorMsg.includes('Invalid email')) {
        displayError = '❌ Nieprawidłowy format emaila.'
      } else if (errorMsg.includes('Network Error') || errorMsg.includes('ERR_CONNECTION_REFUSED')) {
        displayError = '❌ Błąd połączenia. Sprawdź czy backend działa na porcie 4000.'
      } else if (err?.code === 'ERR_NETWORK') {
        displayError = '❌ Brak połączenia z serwerem. Uruchom backend: cd backend && npm run dev'
      } else {
        displayError = '❌ ' + errorMsg
      }
      
      console.log('💬 Displaying error:', displayError)
      setError(displayError)
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
        
        {error && (
          <Box
            mb={4}
            p={4}
            bg="red.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="red.200"
          >
            <Text fontSize="sm" color="red.700" fontWeight="medium">
              {error}
            </Text>
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Email
              </Text>
              <Input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setError('') // Clear error on input
                }}
                placeholder="Wprowadź email"
                required
                size="lg"
                disabled={loading}
                borderColor={error ? 'red.500' : 'gray.300'}
                _focus={{ borderColor: error ? 'red.500' : 'blue.500' }}
                _hover={{ borderColor: error ? 'red.600' : 'gray.400' }}
              />
            </Box>
            
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Hasło (minimum 6 znaków)
              </Text>
              <Input
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setError('') // Clear error on input
                }}
                placeholder="Wprowadź hasło"
                required
                minLength={6}
                size="lg"
                disabled={loading}
                borderColor={error ? 'red.500' : 'gray.300'}
                _focus={{ borderColor: error ? 'red.500' : 'blue.500' }}
                _hover={{ borderColor: error ? 'red.600' : 'gray.400' }}
              />
              {password && password.length < 6 && (
                <Text fontSize="xs" color="orange.600" mt={1}>
                  ⚠️ Hasło powinno mieć minimum 6 znaków
                </Text>
              )}
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
                  onChange={e => {
                    setAdminKey(e.target.value)
                    setError('') // Clear error on input
                  }}
                  placeholder="Wprowadź klucz administratora"
                  size="lg"
                  disabled={loading}
                  required={role === 'admin'}
                  borderColor={error && error.includes('klucz') ? 'red.500' : 'gray.300'}
                  _focus={{ borderColor: error && error.includes('klucz') ? 'red.500' : 'blue.500' }}
                  _hover={{ borderColor: error && error.includes('klucz') ? 'red.600' : 'gray.400' }}
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
                disabled={loading || (password && password.length < 6)}
                loading={loading}
              >
                {loading ? '⏳ Rejestracja...' : '🚀 Zarejestruj się'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                width="100%"
                onClick={() => navigate('/login')}
                type="button"
                disabled={loading}
              >
                🔐 Mam już konto
              </Button>
            </VStack>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}
