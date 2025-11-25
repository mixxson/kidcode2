import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Heading, Button, HStack, VStack, Text, Badge, Spinner } from '@chakra-ui/react'
import api from '../services/api'

export default function RoomsList(){
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('kidcode_user')
      if (raw) setUser(JSON.parse(raw))
    }catch(e){}
    
    api.get('/rooms')
      .then(r => {
        setRooms(r.data.rooms || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <Box textAlign="center" py={8}>
      <Spinner size="lg" />
      <Text mt={4}>Ładowanie pokoi...</Text>
    </Box>
  )

  const canCreate = user && (user.isAdmin || user.role === 'teacher')

  return (
    <Box p={6}>
      <HStack mb={6}>
        <Heading size="lg">Pokoje do kodowania</Heading>
        {canCreate && (
          <Button as={Link} to="/rooms/new" colorPalette="green" size="sm">
            + Nowy pokój
          </Button>
        )}
      </HStack>

      {rooms.length === 0 ? (
        <Text color="gray.500">Brak pokoi. {canCreate ? 'Utwórz pierwszy!' : ''}</Text>
      ) : (
        <VStack align="stretch" gap={3}>
          {rooms.map(room => (
            <Box key={room.id} p={4} borderWidth="1px" borderRadius="md" bg="white">
              <HStack>
                <Box flex="1">
                  <Heading size="sm">{room.name}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Język: {room.language} | Uczeń ID: {room.studentId}
                  </Text>
                </Box>
                <Badge colorPalette={room.active ? 'green' : 'gray'}>
                  {room.active ? 'Aktywny' : 'Nieaktywny'}
                </Badge>
                <Button as={Link} to={`/rooms/${room.id}`} size="sm" colorPalette="blue">
                  Otwórz
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  )
}
