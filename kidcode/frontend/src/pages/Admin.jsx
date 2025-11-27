import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Flex, VStack, HStack, Text, Button, SimpleGrid, Table, Heading, Badge } from '@chakra-ui/react'
import { TrashIcon } from '../components/Icons'
import api from '../services/api'

export default function Admin(){
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState('users') // 'users' or 'lessons'
  const [users, setUsers] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Check admin permissions
  useEffect(()=>{
    try {
      const userStr = localStorage.getItem('kidcode_user')
      const user = userStr ? JSON.parse(userStr) : null
      console.log('Admin check:', user)
      if (!user || !user.isAdmin) {
        console.log('Not admin, redirecting')
        navigate('/login')
        return
      }
      setCurrentUser(user)
      setChecking(false)
    } catch(e) {
      console.error('Admin check error:', e)
      navigate('/login')
    }
  },[navigate]) 

  // Load data based on active tab
  useEffect(()=>{
    if (!checking) {
      loadData()
    }
  },[activeTab, checking])

  async function loadData(){
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const res = await api.get('/users')
        setUsers(res.data.users || [])
      } else {
        const res = await api.get('/lessons')
        setLessons(res.data.lessons || [])
      }
    } catch(err) {
      console.error('Load data error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(userId){
    if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return
    
    try {
      await api.delete(`/users/${userId}`)
      setUsers(users.filter(u => u.id !== userId))
      alert('✅ Użytkownik został usunięty')
    } catch(err) {
      alert('❌ Błąd: ' + (err?.response?.data?.error || err.message))
    }
  }

  async function deleteLesson(lessonId){
    if (!confirm('Czy na pewno chcesz usunąć tę lekcję?')) return
    
    try {
      await api.delete(`/lessons/${lessonId}`)
      setLessons(lessons.filter(l => l.id !== lessonId))
      alert('✅ Lekcja została usunięta')
    } catch(err) {
      alert('❌ Błąd: ' + (err?.response?.data?.error || err.message))
    }
  }

  if (checking) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="lg">⏳ Sprawdzanie uprawnień...</Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={6} p={6} bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        <Heading size="xl" mb={2}>👑 Panel Administratora</Heading>
        <Text color="gray.600">Zarządzaj użytkownikami i lekcjami</Text>
      </Box>

      {/* Tabs */}
      <HStack gap={2} mb={6}>
        <Button
          colorPalette={activeTab === 'users' ? 'blue' : 'gray'}
          variant={activeTab === 'users' ? 'solid' : 'outline'}
          onClick={() => setActiveTab('users')}
        >
          👥 Użytkownicy ({users.length})
        </Button>
        <Button
          colorPalette={activeTab === 'lessons' ? 'blue' : 'gray'}
          variant={activeTab === 'lessons' ? 'solid' : 'outline'}
          onClick={() => setActiveTab('lessons')}
        >
          📚 Lekcje ({lessons.length})
        </Button>
      </HStack>

      {/* Content */}
      <Box bg="white" borderRadius="lg" borderWidth="1px" borderColor="gray.200" boxShadow="sm" p={6}>
        {loading ? (
          <Text textAlign="center" py={8}>⏳ Ładowanie...</Text>
        ) : activeTab === 'users' ? (
          <UsersTab 
            users={users} 
            currentUser={currentUser}
            onDelete={deleteUser}
          />
        ) : (
          <LessonsTab 
            lessons={lessons}
            onDelete={deleteLesson}
            navigate={navigate}
          />
        )}
      </Box>
    </Box>
  )
}

// Users Tab Component
function UsersTab({ users, currentUser, onDelete }) {
  const getRoleBadge = (user) => {
    if (user.isAdmin || user.role === 'admin') {
      return <Badge colorPalette="red">👑 Admin</Badge>
    }
    if (user.role === 'teacher') {
      return <Badge colorPalette="purple">👨‍🏫 Nauczyciel</Badge>
    }
    return <Badge colorPalette="blue">👨‍🎓 Uczeń</Badge>
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Użytkownicy ({users.length})</Heading>
      </Flex>

      {users.length === 0 ? (
        <Text color="gray.600" textAlign="center" py={8}>Brak użytkowników</Text>
      ) : (
        <Box overflowX="auto">
          <Table.Root variant="outline" size="sm">
            <Table.Header>
              <Table.Row bg="gray.50">
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Rola</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="right">Akcje</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map(user => (
                <Table.Row key={user.id}>
                  <Table.Cell fontWeight="medium">#{user.id}</Table.Cell>
                  <Table.Cell>
                    {user.email}
                    {user.id === currentUser?.id && (
                      <Badge ml={2} colorPalette="green" size="sm">To Ty</Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell>{getRoleBadge(user)}</Table.Cell>
                  <Table.Cell textAlign="right">
                    {user.id !== currentUser?.id && (
                      <Button
                        size="sm"
                        colorPalette="red"
                        variant="ghost"
                        onClick={() => onDelete(user.id)}
                      >
                        <TrashIcon /> Usuń
                      </Button>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      )}
    </Box>
  )
}

// Lessons Tab Component
function LessonsTab({ lessons, onDelete, navigate }) {
  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg">Lekcje ({lessons.length})</Heading>
        <Button
          colorPalette="blue"
          onClick={() => navigate('/dashboard')}
        >
          ➕ Dodaj lekcję
        </Button>
      </Flex>

      {lessons.length === 0 ? (
        <Text color="gray.600" textAlign="center" py={8}>Brak lekcji</Text>
      ) : (
        <VStack align="stretch" gap={3}>
          {lessons.map(lesson => (
            <Box
              key={lesson.id}
              p={4}
              bg="gray.50"
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Flex justify="space-between" align="center">
                <Box flex="1">
                  <Heading size="sm" mb={1}>{lesson.title}</Heading>
                  <HStack gap={2} fontSize="xs" color="gray.600">
                    <Text>#{lesson.id}</Text>
                    <Text>•</Text>
                    <Text>{lesson.difficulty}</Text>
                    <Text>•</Text>
                    <Text>{lesson.language === 'python' ? '🐍 Python' : '📜 JavaScript'}</Text>
                    <Text>•</Text>
                    <Text>{lesson.durationMin} min</Text>
                  </HStack>
                </Box>
                <HStack gap={2}>
                  <Button
                    size="sm"
                    colorPalette="blue"
                    variant="outline"
                    onClick={() => navigate(`/lessons/${lesson.id}`)}
                  >
                    👁️ Zobacz
                  </Button>
                  <Button
                    size="sm"
                    colorPalette="red"
                    variant="ghost"
                    onClick={() => onDelete(lesson.id)}
                  >
                    <TrashIcon /> Usuń
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}
