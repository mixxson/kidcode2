import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, VStack, Text, Input, Button, HStack } from '@chakra-ui/react'
import api from '../services/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    console.log('🔐 Starting login...')
    console.log('Email:', email)
    console.log('Password length:', password?.length)
    
    try{
      console.log('📤 Sending request to /auth/login...')
      const r = await api.post('/auth/login', { email, password })
      console.log('✅ Login response:', r.data)
      
      localStorage.setItem('kidcode_token', r.data.token)
      localStorage.setItem('kidcode_user', JSON.stringify(r.data.user))
      
      const user = r.data.user
      console.log('✅ Login successful! User:', user)
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
      console.error('❌ Login error FULL:', err)
      console.error('❌ Error response:', err?.response)
      console.error('❌ Error data:', err?.response?.data)
      console.error('❌ Error message:', err?.message)
      
      const errorMsg = err?.response?.data?.error || err.message || 'Nieznany błąd'
      console.log('📝 Error message extracted:', errorMsg)
      
      // Translate common errors to Polish
      let displayError = errorMsg
      if (errorMsg.includes('User not found') || errorMsg.includes('not found')) {
        displayError = '❌ Użytkownik nie istnieje. Sprawdź email lub zarejestruj się.'
      } else if (errorMsg.includes('Invalid password') || errorMsg.includes('password')) {
        displayError = '❌ Nieprawidłowe hasło. Spróbuj ponownie.'
      } else if (errorMsg.includes('Invalid credentials')) {
        displayError = '❌ Nieprawidłowy email lub hasło.'
      } else if (errorMsg.includes('Email and password required')) {
        displayError = '❌ Email i hasło są wymagane.'
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
          🔐 Logowanie
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
                Hasło
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
                size="lg"
                disabled={loading}
                borderColor={error ? 'red.500' : 'gray.300'}
                _focus={{ borderColor: error ? 'red.500' : 'blue.500' }}
                _hover={{ borderColor: error ? 'red.600' : 'gray.400' }}
              />
            </Box>
            
            <VStack gap={2} mt={4} align="stretch">
              <Button
                type="submit"
                colorPalette="blue"
                size="lg"
                width="100%"
                disabled={loading}
                loading={loading}
              >
                {loading ? '⏳ Logowanie...' : '🔐 Zaloguj'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                width="100%"
                onClick={() => navigate('/register')}
                type="button"
                disabled={loading}
              >
                📝 Rejestracja
              </Button>
            </VStack>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}
