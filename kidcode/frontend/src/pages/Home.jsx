import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { Box, Flex, VStack, HStack, Text, Button, SimpleGrid, Skeleton, Stack } from '@chakra-ui/react'
import api from '../services/api'
import { TrashIcon, EditIcon, CodeIcon } from '../components/Icons'

export default function Home(){
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [user, setUser] = useState(null)
  
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
    axios.get('http://localhost:4000/api/lessons')
      .then(r => { setLessons(r.data.lessons); setLoading(false) })
      .catch(()=> setLoading(false))
  },[])

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
            Ucz się kodowania krok po kroku z zabawnymi lekcjami i projektami
          </Text>
          <HStack justify="center" gap={4}>
            <Button 
              size="xl" 
              colorPalette="green" 
              onClick={() => window.location.href = '/register'}
              px={8}
              py={6}
              fontSize="lg"
            >
              🚀 Zacznij teraz - za darmo!
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              onClick={() => window.location.href = '/login'}
              px={8}
              py={6}
              fontSize="lg"
              color="white"
              borderColor="white"
              _hover={{ bg: 'whiteAlpha.200' }}
            >
              Mam już konto
            </Button>
          </HStack>
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
          p={12} 
          bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          borderRadius="xl"
          textAlign="center"
          color="white"
        >
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            Gotowy, aby zacząć swoją przygodę z programowaniem?
          </Text>
          <Text fontSize="lg" mb={6} opacity={0.95}>
            Dołącz do tysięcy dzieci, które już się uczą!
          </Text>
          <Button 
            size="xl" 
            colorPalette="green"
            onClick={() => window.location.href = '/register'}
            px={12}
            py={6}
            fontSize="xl"
            bg="white"
            color="purple.600"
            _hover={{ bg: 'gray.100' }}
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
      <Box mb={6} p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Text fontSize="3xl" fontWeight="bold" mb={2}>
          Witaj z powrotem, {user.email?.split('@')[0]}! 👋
        </Text>
        <Text fontSize="md" color="gray.600" mb={4}>
          Kontynuuj naukę programowania z interaktywnymi lekcjami!
        </Text>
        <HStack gap={3}>
          <Button onClick={() => window.location.href = '/lessons'} colorPalette="blue" size="md">
            📚 Przeglądaj lekcje
          </Button>
          <Button onClick={() => window.location.href = '/rooms'} colorPalette="purple" size="md">
            🚪 Moje pokoje
          </Button>
        </HStack>
      </Box>

      <Box p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          � Twoje lekcje
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
            {lessons.slice(0, 5).map(l => (
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
                    <Text fontWeight="bold" color="blue.600" cursor="pointer" onClick={() => window.location.href = `/lessons/${l.id}`}>
                      {l.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {l.difficulty} — {l.durationMin} min
                    </Text>
                  </Box>
                  
                  <Button
                    size="sm"
                    colorPalette="blue"
                    onClick={() => window.location.href = `/lessons/${l.id}`}
                  >
                    Rozpocznij →
                  </Button>
                </Flex>
              </Box>
            ))}
          </Stack>
        )}
        {lessons.length > 5 && (
          <Box mt={4}>
            <Button
              colorPalette="blue"
              variant="outline"
              onClick={() => window.location.href = '/lessons'}
            >
              Zobacz wszystkie lekcje ({lessonCount}) →
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
