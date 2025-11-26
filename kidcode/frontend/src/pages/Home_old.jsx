import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Box, Flex, VStack, HStack, Text, Button, SimpleGrid } from '@chakra-ui/react'

export default function Home(){
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  
  // Check user role for redirect
  useEffect(()=>{
    try{
      const raw = localStorage.getItem('kidcode_user')
      if (raw) {
        setUser(JSON.parse(raw))
      }
    }catch(e){
      console.error('Error loading user:', e)
    }
  },[])

  // Redirect teachers and admins to dashboard immediately
  if (user && (user.role === 'teacher' || user.isAdmin || user.role === 'admin')) {
    return <Navigate to="/dashboard" replace />
  }
  
  // If user is logged in (student), redirect to lessons
  if (user && user.role === 'student') {
    return <Navigate to="/lessons" replace />
  }

  // Landing page for non-logged users
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        mb={8} 
        p={12} 
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        borderRadius="xl"
        color="white"
        textAlign="center"
      >
        <Text fontSize="5xl" fontWeight="bold" mb={4}>
          🎓 KidCode
        </Text>
        <Text fontSize="2xl" mb={2}>
          Interaktywna platforma do nauki programowania dla dzieci
        </Text>
        <Text fontSize="lg" mb={8} opacity={0.9}>
          Ucz się kodowania krok po kroku z interaktywnymi lekcjami i praktycznymi zadaniami
        </Text>
        <HStack gap={4} justify="center">
          <Button 
            size="lg" 
            colorPalette="green"
            onClick={() => navigate('/register')}
            px={8}
            py={6}
            fontSize="lg"
          >
            🚀 Rozpocznij naukę
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate('/login')}
            px={8}
            py={6}
            fontSize="lg"
            bg="white"
            color="purple.600"
            _hover={{ bg: 'gray.100' }}
          >
            � Zaloguj się
          </Button>
        </HStack>
      </Box>

      {/* Features Section */}
      <Box mb={8}>
        <Text fontSize="3xl" fontWeight="bold" mb={6} textAlign="center">
          ✨ Co oferujemy?
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="md"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Text fontSize="4xl" mb={3}>📚</Text>
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Interaktywne lekcje
            </Text>
            <Text color="gray.600">
              Krótkie moduły z przykładami kodu, wyjaśnieniami i praktycznymi ćwiczeniami. 
              Każda lekcja jest zaprojektowana tak, aby dzieci mogły uczyć się w swoim tempie.
            </Text>
          </Box>

          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="md"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Text fontSize="4xl" mb={3}>💻</Text>
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Wbudowany edytor kodu
            </Text>
            <Text color="gray.600">
              Pisz i uruchamiaj kod JavaScript bezpośrednio w przeglądarce. 
              Bezpieczne środowisko piaskownicy pozwala eksperymentować bez obaw.
            </Text>
          </Box>

          <Box
            p={6}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            boxShadow="md"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Text fontSize="4xl" mb={3}>👥</Text>
            <Text fontSize="xl" fontWeight="bold" mb={3}>
              Współpraca w czasie rzeczywistym
            </Text>
            <Text color="gray.600">
              Twórz pokoje do wspólnej pracy. Nauczyciele mogą obserwować postępy uczniów 
              i pomagać im na żywo podczas nauki programowania.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>

      {!isStudent && (
        <Box mb={6} p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            🚀 Szybki start
          </Text>
          <VStack align="stretch" gap={2} fontSize="sm">
            <Text>1. Uruchom backend: <Text as="span" fontFamily="mono" bg="gray.100" px={2} py={1} borderRadius="md">cd backend && npm install && npm run dev</Text></Text>
            <Text>2. Uruchom frontend: <Text as="span" fontFamily="mono" bg="gray.100" px={2} py={1} borderRadius="md">cd frontend && npm install && npm run dev</Text></Text>
            <Text>3. Otwórz w przeglądarce adres <Text as="span" fontWeight="bold">http://localhost:5173</Text></Text>
          </VStack>
        </Box>
      )}

      <Box mb={6} p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">📊 Statystyki</Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              Liczba lekcji: <Text as="span" fontWeight="bold" color="blue.600">{lessonCount}</Text>
            </Text>
          </Box>
          <HStack gap={2} fontSize="sm">
            <Button asChild size="sm" variant="ghost">
              <Link to="/admin">Admin</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href="/docs/install.md">Docs</a>
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Box p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          📚 {isStudent ? 'Najbliższe lekcje' : 'Ostatnie lekcje'}
        </Text>
        
        {loading && (
          <Stack gap={3}>
            <Skeleton height="60px" borderRadius="md" />
            <Skeleton height="60px" borderRadius="md" />
            <Skeleton height="60px" borderRadius="md" />
          </Stack>
        )}
        
        {!loading && lessons.length === 0 && (
          <Text fontSize="sm" color="gray.600">
            Brak lekcji. {isTeacherOrAdmin && 'Dodaj pierwszą!'}
          </Text>
        )}
        
        {!loading && lessons.length > 0 && (
          <Stack gap={3}>
            {(isStudent ? lessons.slice(0, 3) : lessons).map(l => (
              <Box
                key={l.id}
                p={4}
                bg="gray.50"
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
                _hover={{ borderColor: 'blue.300', boxShadow: 'sm' }}
                transition="all 0.2s"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Link to={`/lessons/${l.id}`}>
                      <Text fontWeight="bold" color="blue.600" _hover={{ textDecoration: 'underline' }}>
                        {l.title}
                      </Text>
                    </Link>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {l.difficulty} — {l.durationMin} min
                    </Text>
                  </Box>
                  
                  <HStack gap={2}>
                    <Button asChild size="sm" colorPalette="blue">
                      <Link to={`/lessons/${l.id}`}>
                        <CodeIcon /> Rozpocznij
                      </Link>
                    </Button>
                    {isTeacherOrAdmin && (
                      <>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/admin/${l.id}`}>
                            <EditIcon /> Edytuj
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          colorPalette="red"
                          variant="ghost"
                          onClick={async () => {
                            if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
                            try {
                              await api.delete(`/lessons/${l.id}`)
                              setLessons(prev => prev.filter(x => x.id !== l.id))
                            } catch (err) {
                              alert('Błąd podczas usuwania')
                            }
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </>
                    )}
                  </HStack>
                </Flex>
              </Box>
            ))}
          </Stack>
        )}
        {isStudent && lessons.length > 3 && (
          <Box mt={4}>
            <Button asChild colorPalette="blue" variant="outline">
              <Link to="/lessons">Zobacz wszystkie lekcje →</Link>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
