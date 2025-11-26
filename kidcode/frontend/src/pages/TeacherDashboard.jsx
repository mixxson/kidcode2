import React, { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid,
  Badge,
  HStack,
  VStack,
  Skeleton,
  Stack
} from '@chakra-ui/react'
import api from '../services/api'

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true)
  const [rooms, setRooms] = useState([])
  const [students, setStudents] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = JSON.parse(localStorage.getItem('kidcode_user') || '{}')
    if (!userData.id) {
      window.location.href = '/login'
      return
    }
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const userData = JSON.parse(localStorage.getItem('kidcode_user') || '{}')
      setUser(userData)

      // Load rooms - handle both array and object response
      try {
        const roomsRes = await api.get('/rooms')
        const roomsData = Array.isArray(roomsRes.data) ? roomsRes.data : (roomsRes.data?.rooms || [])
        setRooms(roomsData)
      } catch(roomErr) {
        console.error('Error loading rooms:', roomErr)
        setRooms([])
      }

      // Load students
      try {
        const studentsRes = await api.get('/users/students')
        const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : []
        setStudents(studentsData)
      } catch(studErr) {
        console.error('Error loading students:', studErr)
        setStudents([])
      }
    } catch(err) {
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const myRooms = rooms.filter(r => r.teacherId === user?.id)
  const totalRooms = myRooms.length
  const activeRooms = myRooms.filter(r => r.active !== false).length
  const totalStudents = students.length

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" gap={1}>
          <Heading size="lg">Dashboard Nauczyciela</Heading>
          <Text color="gray.600" fontSize="sm">
            Witaj, {user?.email?.split('@')[0]}! 👋
          </Text>
        </VStack>
        <Button 
          asChild
          colorPalette="blue" 
          size="sm"
        >
          <RouterLink to="/rooms/new">+ Nowy Pokój</RouterLink>
        </Button>
      </Flex>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={8}>
        <StatCard
          icon="🚪"
          label="Wszystkie Pokoje"
          value={loading ? <Skeleton height="32px" /> : totalRooms}
          color="blue"
        />
        <StatCard
          icon="🟢"
          label="Aktywne Sesje"
          value={loading ? <Skeleton height="32px" /> : activeRooms}
          color="green"
        />
        <StatCard
          icon="👨‍🎓"
          label="Uczniowie"
          value={loading ? <Skeleton height="32px" /> : totalStudents}
          color="purple"
        />
        <StatCard
          icon="📚"
          label="Lekcje"
          value={loading ? <Skeleton height="32px" /> : "-"}
          color="orange"
        />
      </SimpleGrid>

      {/* Active Rooms List */}
      <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" p={4} mb={6}>
        <Heading size="md" mb={4}>Twoje Pokoje</Heading>
        
        {loading ? (
          <Stack gap={2}>
            <Skeleton height="60px" />
            <Skeleton height="60px" />
            <Skeleton height="60px" />
          </Stack>
        ) : myRooms.length === 0 ? (
          <Box py={8} textAlign="center">
            <Text color="gray.500" mb={4}>
              Nie masz jeszcze żadnych pokoi
            </Text>
            <Button asChild colorPalette="blue" size="sm">
              <RouterLink to="/rooms/new">Utwórz pierwszy pokój</RouterLink>
            </Button>
          </Box>
        ) : (
          <Stack gap={3}>
            {myRooms.map(room => {
              const student = students.find(s => s.id === room.studentId)
              return (
                <Box 
                  key={room.id}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ bg: 'gray.100', borderColor: 'gray.300' }}
                  transition="all 0.2s"
                >
                  <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
                    <VStack align="start" gap={1} flex="1">
                      <Text fontWeight="bold" fontSize="md">{room.name}</Text>
                      <HStack gap={2} flexWrap="wrap">
                        {student && (
                          <Text fontSize="sm" color="gray.600">
                            👨‍🎓 {student.email}
                          </Text>
                        )}
                        <Badge size="sm" colorPalette={room.language === 'python' ? 'blue' : 'yellow'}>
                          {room.language === 'python' ? '🐍 Python' : '📜 JavaScript'}
                        </Badge>
                        <Badge 
                          size="sm" 
                          colorPalette={room.active !== false ? 'green' : 'gray'}
                        >
                          {room.active !== false ? '🟢 Aktywny' : '⚫ Nieaktywny'}
                        </Badge>
                      </HStack>
                    </VStack>
                    
                    <Button 
                      asChild
                      size="sm" 
                      colorPalette="blue"
                      variant="solid"
                    >
                      <RouterLink to={`/rooms/${room.id}`}>
                        Otwórz Pokój
                      </RouterLink>
                    </Button>
                  </Flex>
                </Box>
              )
            })}
          </Stack>
        )}
      </Box>

      {/* Students List */}
      <Box bg="white" borderRadius="lg" border="1px" borderColor="gray.200" p={4}>
        <Heading size="md" mb={4}>Twoi Uczniowie</Heading>
        
        {loading ? (
          <Stack gap={2}>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="40px" />
          </Stack>
        ) : students.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={4}>
            Brak uczniów w systemie
          </Text>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
            {students.map(student => (
              <Box 
                key={student.id}
                p={4}
                bg="gray.50"
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
                _hover={{ bg: 'gray.100' }}
                transition="all 0.2s"
              >
                <HStack justify="space-between">
                  <VStack align="start" gap={0}>
                    <Text fontWeight="medium" fontSize="sm">
                      {student.email}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      ID: {student.id}
                    </Text>
                  </VStack>
                  <Badge size="sm" colorPalette="blue">
                    👨‍🎓 Uczeń
                  </Badge>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  )
}

// Statistics Card Component
function StatCard({ icon, label, value, color }) {
  return (
    <Box 
      bg="white" 
      borderRadius="lg" 
      border="1px" 
      borderColor="gray.200"
      p={4}
      _hover={{ borderColor: `${color}.300`, shadow: 'md' }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" mb={2}>
        <Text fontSize="2xl">{icon}</Text>
        <Badge colorPalette={color} size="sm">
          {label}
        </Badge>
      </HStack>
      <Text fontSize="3xl" fontWeight="bold" color={`${color}.600`}>
        {value}
      </Text>
    </Box>
  )
}
