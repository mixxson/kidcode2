import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { Box, Flex, VStack, HStack, Text, Button, SimpleGrid, Skeleton, Stack } from '@chakra-ui/react'
import api, { progressAPI } from '../services/api'
import { TrashIcon, EditIcon, CodeIcon } from '../components/Icons'

export default function Home(){
  const [lessons, setLessons] = useState([])
  const [rooms, setRooms] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  
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

  const features = [
    { id: 'lessons', title: 'Interaktywne lekcje', short: 'Krótkie moduły z przykładami i ćwiczeniami.', long: 'Interaktywne lekcje zawierają krótkie wprowadzenia, przykłady i małe zadania praktyczne dla dzieci. Każda lekcja ma starter code oraz opis, który można edytować w panelu administracyjnym.' },
    { id: 'editor', title: 'Wbudowany edytor', short: 'Uruchamiaj kod w przeglądarce.', long: 'Edytor działa w piaskownicy (iframe) — użytkownik może pisać JavaScript i natychmiast zobaczyć wynik. To bezpieczne środowisko do nauki podstaw.' },
    { id: 'admin', title: 'Panel administracyjny', short: 'Twórz i edytuj lekcje.', long: 'Panel administracyjny pozwala tworzyć nowe lekcje, edytować istniejące oraz dbać o treści. Dane są zapisywane w pliku JSON podczas developmentu; w produkcji warto użyć bazy danych.' }
  ]
  
  useEffect(()=>{
    loadData()
  },[user])

  async function loadData(){
    setLoading(true)
    try{
      // Load lessons
      const lessonsRes = await axios.get('http://localhost:4000/api/lessons')
      setLessons(lessonsRes.data.lessons || [])
      
      const token = localStorage.getItem('kidcode_token')
      if(token && user){
        // Load progress
        try{
          const progressRes = await progressAPI.getUserProgress()
          setProgress(progressRes.data.progress || [])
          
          const statsRes = await progressAPI.getStatistics()
          setStats(statsRes.data.statistics)
        }catch(err){
          console.log('Progress not available')
        }
        
        // Load rooms
        try{
          const roomsRes = await api.get('/rooms')
          setRooms(roomsRes.data.rooms || [])
        }catch(err){
          console.log('Rooms not available')
        }
      }
    }catch(err){
      console.error(err)
    }finally{
      setLoading(false)
    }
  }

  function getLessonStatus(lessonId){
    const entry = progress.find(p => p.lessonId === lessonId)
    return entry ? entry.status : 'new'
  }

  const lessonCount = lessons.length

  const isStudent = user && user.role === 'student'
  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'admin' || user.isAdmin)

  // Redirect teachers and admins to dashboard immediately
  if (user && (user.role === 'teacher' || user.isAdmin)) {
    return <Navigate to="/dashboard" replace />
  }

  // Landing page for non-logged-in users
  if (!user) {
    return (
      <Box pb={8}>
        {/* Hero Section */}
        <Box 
          mb={8} 
          p={{ base: 8, md: 12 }}
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          borderRadius="xl"
          color="white"
          textAlign="center"
        >
          <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold" mb={4}>
            🎓 KidCode
          </Text>
          <Text fontSize={{ base: 'xl', md: '2xl' }} mb={2}>
            Interaktywna platforma do nauki programowania dla dzieci
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} mb={8} opacity={0.9}>
            Ucz się kodowania krok po kroku z zabawnymi lekcjami i projektami
          </Text>
          <Flex 
            direction={{ base: 'column', sm: 'row' }} 
            justify="center" 
            align="center"
            gap={4}
            flexWrap="wrap"
          >
            <Button 
              size={{ base: 'lg', md: 'xl' }}
              colorPalette="green" 
              onClick={() => window.location.href = '/register'}
              px={{ base: 6, md: 8 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: 'md', md: 'lg' }}
              w={{ base: 'full', sm: 'auto' }}
            >
              🚀 Zacznij teraz - za darmo!
            </Button>
            <Button 
              size={{ base: 'lg', md: 'xl' }}
              variant="outline" 
              onClick={() => window.location.href = '/login'}
              px={{ base: 6, md: 8 }}
              py={{ base: 5, md: 6 }}
              fontSize={{ base: 'md', md: 'lg' }}
              color="white"
              borderColor="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              w={{ base: 'full', sm: 'auto' }}
            >
              Mam już konto
            </Button>
          </Flex>
        </Box>

        {/* Features Section */}
        <Box mb={8}>
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={8}>
            ✨ Co oferuje KidCode?
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
            <Box 
              p={6} 
              bg="white" 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor="gray.200"
              textAlign="center"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
            >
              <Text fontSize="4xl" mb={3}>📚</Text>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Interaktywne lekcje
              </Text>
              <Text color="gray.600">
                Krótkie, zabawne moduły z przykładami kodu i praktycznymi ćwiczeniami. 
                Każda lekcja jest zaprojektowana specjalnie dla dzieci.
              </Text>
            </Box>

            <Box 
              p={6} 
              bg="white" 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor="gray.200"
              textAlign="center"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
            >
              <Text fontSize="4xl" mb={3}>💻</Text>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Edytor kodu w przeglądarce
              </Text>
              <Text color="gray.600">
                Pisz i uruchamiaj kod bezpośrednio w przeglądarce! 
                Bezpieczne środowisko do eksperymentowania z kodem.
              </Text>
            </Box>

            <Box 
              p={6} 
              bg="white" 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor="gray.200"
              textAlign="center"
              _hover={{ boxShadow: 'xl', transform: 'translateY(-4px)' }}
              transition="all 0.3s"
            >
              <Text fontSize="4xl" mb={3}>👥</Text>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Współpraca w czasie rzeczywistym
              </Text>
              <Text color="gray.600">
                Twórz pokoje i programuj razem z innymi! 
                Nauczyciele mogą prowadzić zajęcia online w czasie rzeczywistym.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* How it works */}
        <Box mb={8} p={8} bg="gray.50" borderRadius="xl">
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={8}>
            🎯 Jak to działa?
          </Text>
          <VStack align="stretch" gap={4} maxW="800px" mx="auto">
            <Flex align="center" gap={4}>
              <Box 
                minW="50px" 
                h="50px" 
                bg="blue.500" 
                color="white" 
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
              >
                1
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">Zarejestruj się za darmo</Text>
                <Text color="gray.600">Utwórz konto w kilka sekund - jako uczeń, nauczyciel lub administrator</Text>
              </Box>
            </Flex>

            <Flex align="center" gap={4}>
              <Box 
                minW="50px" 
                h="50px" 
                bg="green.500" 
                color="white" 
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
              >
                2
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">Wybierz lekcję</Text>
                <Text color="gray.600">Przeglądaj lekcje od podstaw do zaawansowanych - JavaScript, Python i więcej!</Text>
              </Box>
            </Flex>

            <Flex align="center" gap={4}>
              <Box 
                minW="50px" 
                h="50px" 
                bg="purple.500" 
                color="white" 
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xl"
                fontWeight="bold"
              >
                3
              </Box>
              <Box>
                <Text fontSize="lg" fontWeight="bold">Koduj i ucz się!</Text>
                <Text color="gray.600">Pisz kod, wykonuj zadania i zobacz wyniki natychmiast w przeglądarce</Text>
              </Box>
            </Flex>
          </VStack>
        </Box>

        {/* CTA Section */}
        <Box 
          p={{ base: 8, md: 12 }}
          bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          borderRadius="xl"
          textAlign="center"
          color="white"
          mb={8}
        >
          <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold" mb={4}>
            Gotowy, aby zacząć swoją przygodę z programowaniem?
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} mb={6} opacity={0.95}>
            Dołącz do tysięcy dzieci, które już się uczą!
          </Text>
          <Button 
            size={{ base: 'lg', md: 'xl' }}
            colorPalette="green"
            onClick={() => window.location.href = '/register'}
            px={{ base: 8, md: 12 }}
            py={{ base: 5, md: 6 }}
            fontSize={{ base: 'lg', md: 'xl' }}
            bg="white"
            color="purple.600"
            _hover={{ bg: 'gray.100' }}
            w={{ base: 'full', sm: 'auto' }}
          >
            🎉 Rozpocznij naukę za darmo!
          </Button>
        </Box>
      </Box>
    )
  }

  // Logged-in user view (students)
  return (
    <Box>
      {/* Welcome Section */}
      <Box mb={6} p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Text fontSize="3xl" fontWeight="bold" mb={2}>
          Witaj z powrotem, {user.email?.split('@')[0]}! 👋
        </Text>
        <Text fontSize="md" color="gray.600" mb={4}>
          Kontynuuj naukę programowania z interaktywnymi lekcjami!
        </Text>

        <HStack gap={3} flexWrap="wrap">
          <Button onClick={() => window.location.href = '/lessons'} colorPalette="blue" size="md">
            📚 Wszystkie lekcje
          </Button>
          <Button onClick={() => window.location.href = '/rooms'} colorPalette="purple" size="md">
            🚪 Pokoje
          </Button>
        </HStack>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
        {/* Lessons Overview */}
        <Box p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            📚 Podsumowanie lekcji
          </Text>
          
          {loading ? (
            <Stack gap={3}>
              <Skeleton height="60px" borderRadius="md" />
              <Skeleton height="60px" borderRadius="md" />
            </Stack>
          ) : (
            <>
              <VStack align="stretch" gap={3} mb={4}>
                <Flex justify="space-between" align="center" p={3} bg="blue.50" borderRadius="md">
                  <HStack>
                    <Text fontSize="2xl">📖</Text>
                    <Text fontWeight="bold">Wszystkich lekcji</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {lessons.length}
                  </Text>
                </Flex>
                
                <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                  <HStack>
                    <Text fontSize="2xl">🆕</Text>
                    <Text fontWeight="bold">Nowych</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.600">
                    {stats?.new || lessons.length - progress.length}
                  </Text>
                </Flex>
                
                <Flex justify="space-between" align="center" p={3} bg="blue.50" borderRadius="md">
                  <HStack>
                    <Text fontSize="2xl">⏳</Text>
                    <Text fontWeight="bold">W trakcie</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {stats?.inProgress || 0}
                  </Text>
                </Flex>
                
                <Flex justify="space-between" align="center" p={3} bg="green.50" borderRadius="md">
                  <HStack>
                    <Text fontSize="2xl">✅</Text>
                    <Text fontWeight="bold">Ukończonych</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {stats?.completed || 0}
                  </Text>
                </Flex>
              </VStack>
              
              <Button
                colorPalette="blue"
                w="100%"
                onClick={() => window.location.href = '/lessons'}
              >
                Zobacz wszystkie lekcje →
              </Button>
            </>
          )}
        </Box>

        {/* Rooms Overview */}
        <Box p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            🚪 Pokoje współpracy
          </Text>
          
          {loading ? (
            <Stack gap={3}>
              <Skeleton height="60px" borderRadius="md" />
              <Skeleton height="60px" borderRadius="md" />
            </Stack>
          ) : (
            <>
              <Box mb={4} p={4} bg="purple.50" borderRadius="md" borderWidth="1px" borderColor="purple.200">
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Pokoje pozwalają na wspólną pracę nad kodem w czasie rzeczywistym. 
                  Nauczyciele mogą tworzyć pokoje dla swoich uczniów!
                </Text>
                <Flex justify="space-between" align="center" mt={3}>
                  <HStack>
                    <Text fontSize="2xl">👥</Text>
                    <Text fontWeight="bold">Dostępnych pokoi</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {rooms.length}
                  </Text>
                </Flex>
              </Box>

              {rooms.length > 0 ? (
                <VStack align="stretch" gap={2} mb={4}>
                  {rooms.slice(0, 3).map(room => (
                    <Flex 
                      key={room.id} 
                      justify="space-between" 
                      align="center" 
                      p={3} 
                      bg="gray.50" 
                      borderRadius="md"
                      _hover={{ bg: 'gray.100' }}
                      cursor="pointer"
                      onClick={() => window.location.href = `/rooms/${room.id}`}
                    >
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">{room.name}</Text>
                        <Text fontSize="xs" color="gray.600">
                          {room.participants?.length || 0} uczestników
                        </Text>
                      </Box>
                      <Text fontSize="lg">→</Text>
                    </Flex>
                  ))}
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Brak aktywnych pokoi. Poczekaj, aż nauczyciel utworzy pokój!
                </Text>
              )}
              
              <Button
                colorPalette="purple"
                w="100%"
                onClick={() => window.location.href = '/rooms'}
              >
                Zobacz wszystkie pokoje →
              </Button>
            </>
          )}
        </Box>
      </SimpleGrid>

      {/* Recent Lessons */}
      <Box p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          🎯 Rozpocznij naukę
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
            Brak dostępnych lekcji.
          </Text>
        )}
        
        {!loading && lessons.length > 0 && (
          <Stack gap={3}>
            {lessons.slice(0, 5).map(l => {
              const status = getLessonStatus(l.id)
              const statusInfo = {
                'new': { icon: '🆕', text: 'Nowa', color: 'gray.600' },
                'in-progress': { icon: '⏳', text: 'W trakcie', color: 'blue.600' },
                'completed': { icon: '✅', text: 'Ukończona', color: 'green.600' }
              }[status]

              return (
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
                  <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                    <Box flex="1" minW="200px">
                      <HStack mb={1}>
                        <Text fontWeight="bold" color="blue.600" cursor="pointer" onClick={() => window.location.href = `/lessons/${l.id}`}>
                          {l.title}
                        </Text>
                        <Text fontSize="xs" color={statusInfo.color}>
                          {statusInfo.icon} {statusInfo.text}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {l.difficulty} • {l.language === 'python' ? '🐍 Python' : '📜 JavaScript'} • {l.durationMin} min
                      </Text>
                    </Box>
                    
                    <Button
                      size="sm"
                      colorPalette={status === 'completed' ? 'green' : 'blue'}
                      onClick={() => window.location.href = `/lessons/${l.id}`}
                    >
                      {status === 'new' ? 'Rozpocznij →' : status === 'in-progress' ? 'Kontynuuj →' : 'Powtórz'}
                    </Button>
                  </Flex>
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
