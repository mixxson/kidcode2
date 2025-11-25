import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export function useSocket() {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [connectionError, setConnectionError] = useState(null)

  // Connect to socket
  const connect = useCallback(() => {
    const token = localStorage.getItem('kidcode_token')
    if (!token) {
      console.log('No token found, skipping socket connection')
      return
    }

    console.log('🔌 Connecting to socket server...')
    
    const newSocket = io('http://localhost:4000', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    })

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id)
      setIsConnected(true)
      setIsReconnecting(false)
      setConnectionError(null)
    })

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason)
      setIsConnected(false)
      
      if (reason === 'io server disconnect') {
        // Server disconnected, need to reconnect manually
        setTimeout(() => newSocket.connect(), 1000)
      }
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message)
      setConnectionError(error.message)
      setIsReconnecting(true)
    })

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Socket reconnected after ${attemptNumber} attempts`)
      setIsConnected(true)
      setIsReconnecting(false)
      setConnectionError(null)
    })

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnect attempt ${attemptNumber}`)
      setIsReconnecting(true)
    })

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ Reconnection error:', error.message)
      setConnectionError(error.message)
    })

    newSocket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed after maximum attempts')
      setIsReconnecting(false)
      setConnectionError('Failed to reconnect to server')
    })

    // Custom error event from server
    newSocket.on('error', (error) => {
      console.error('❌ Server error:', error)
      setConnectionError(error.message || 'Server error')
    })

    setSocket(newSocket)

    return newSocket
  }, [])

  // Disconnect socket
  const disconnect = useCallback(() => {
    if (socket) {
      console.log('🔌 Disconnecting socket...')
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
      setIsReconnecting(false)
    }
  }, [socket])

  // Join room
  const joinRoom = useCallback((roomId, callback) => {
    if (!socket || !isConnected) {
      console.error('Cannot join room: socket not connected')
      return
    }

    console.log('📍 Joining room:', roomId)
    socket.emit('room:join', { roomId }, (response) => {
      if (response?.error) {
        console.error('Failed to join room:', response.error)
        setConnectionError(response.error)
      } else {
        console.log('✅ Joined room:', roomId)
      }
      if (callback) callback(response)
    })
  }, [socket, isConnected])

  // Leave room
  const leaveRoom = useCallback((roomId) => {
    if (!socket) return

    console.log('🚪 Leaving room:', roomId)
    socket.emit('room:leave', { roomId })
  }, [socket])

  // Debounced code update (to reduce network traffic)
  const debounceTimers = useRef({})
  
  const sendCodeUpdate = useCallback((roomId, code, language) => {
    if (!socket || !isConnected) {
      console.warn('Cannot send code: socket not connected')
      return
    }

    // Clear existing timer for this room
    if (debounceTimers.current[roomId]) {
      clearTimeout(debounceTimers.current[roomId])
    }

    // Set new timer
    debounceTimers.current[roomId] = setTimeout(() => {
      socket.emit('code:update', { roomId, code, language })
      delete debounceTimers.current[roomId]
    }, 100) // 100ms debounce
  }, [socket, isConnected])

  // Listen for code updates
  const onCodeUpdate = useCallback((callback) => {
    if (!socket) return

    socket.on('code:update', callback)
    
    // Return cleanup function
    return () => {
      socket.off('code:update', callback)
    }
  }, [socket])

  // Send cursor position
  const sendCursorPosition = useCallback((roomId, position) => {
    if (!socket || !isConnected) return

    socket.emit('cursor:update', { roomId, position })
  }, [socket, isConnected])

  // Listen for cursor updates
  const onCursorUpdate = useCallback((callback) => {
    if (!socket) return

    socket.on('cursor:update', callback)
    
    return () => {
      socket.off('cursor:update', callback)
    }
  }, [socket])

  // Auto-connect when component mounts and token exists
  useEffect(() => {
    const token = localStorage.getItem('kidcode_token')
    if (token && !socket) {
      connect()
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, []) // Only run once on mount

  const value = {
    socket,
    isConnected,
    isReconnecting,
    connectionError,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendCodeUpdate,
    onCodeUpdate,
    sendCursorPosition,
    onCursorUpdate
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
