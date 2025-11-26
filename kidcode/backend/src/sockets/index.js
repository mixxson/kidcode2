const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const usersPath = path.join(__dirname, '..', 'data', 'users.json')
function readUsers(){
  try{ return JSON.parse(fs.readFileSync(usersPath,'utf8')) }catch(e){ return [] }
}

module.exports = function initSockets(httpServer){
  const io = new Server(httpServer, {
    cors: { origin: '*', methods: ['GET','POST'] },
    // Increase max buffer size and timeout to handle fast typing
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8 // 100 MB
  })

  // Debounce file writes to avoid too many disk operations
  const saveTimers = {}
  
  function debouncedSaveRoom(roomId, code, language) {
    if (saveTimers[roomId]) {
      clearTimeout(saveTimers[roomId])
    }
    
    saveTimers[roomId] = setTimeout(() => {
      const roomsPath = path.join(__dirname, '..', 'data', 'rooms.json')
      try {
        const rooms = JSON.parse(fs.readFileSync(roomsPath, 'utf8'))
        const roomIndex = rooms.findIndex(r => r.id === Number(roomId))
        if (roomIndex !== -1) {
          rooms[roomIndex].code = code
          if (language) rooms[roomIndex].language = language
          fs.writeFileSync(roomsPath, JSON.stringify(rooms, null, 2), 'utf8')
          console.log(`💾 Saved room ${roomId} to disk`)
        }
      } catch(e) {
        console.error('Failed to save room code:', e)
      }
      delete saveTimers[roomId]
    }, 1000) // Save to disk 1 second after last update
  }

  // Auth middleware for Socket.IO
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token
        || (socket.handshake.headers?.authorization?.split(' ')[1])
      if (!token) return next(new Error('NO_TOKEN'))
      const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
      const payload = jwt.verify(token, secret)
      const users = readUsers()
      const user = users.find(u => u.id === payload.id)
      if (!user) return next(new Error('USER_NOT_FOUND'))
      socket.user = { id: user.id, email: user.email, role: user.role || (user.isAdmin ? 'admin' : 'student'), isAdmin: !!user.isAdmin }
      next()
    } catch (e) {
      next(new Error('BAD_TOKEN'))
    }
  })

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.user.email)

    // Join/leave rooms
    socket.on('room:join', ({ roomId }, callback) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.join(roomName)
      console.log(`${socket.user.email} joined room ${roomId}`)
      
      // Notify others in the room
      socket.to(roomName).emit('user:joined', { userId: socket.user.id, email: socket.user.email })
      
      // Load room data from file if exists
      const roomsPath = path.join(__dirname, '..', 'data', 'rooms.json')
      try {
        const rooms = JSON.parse(fs.readFileSync(roomsPath, 'utf8'))
        const room = rooms.find(r => r.id === Number(roomId))
        if (room && callback) {
          callback({ room })
        }
      } catch(e) {
        console.error('Failed to load room:', e)
      }
    })

    socket.on('room:leave', ({ roomId }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.leave(roomName)
      socket.to(roomName).emit('user:left', { userId: socket.user.id })
    })

    // Code sync events
    socket.on('code:update', ({ roomId, code, language }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      
      // Broadcast to others immediately (low latency)
      socket.to(roomName).emit('code:update', { code, language, userId: socket.user.id })
      
      // Save to disk with debouncing (avoid too many writes)
      debouncedSaveRoom(roomId, code, language)
    })

    socket.on('cursor:update', ({ roomId, cursor }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.to(roomName).emit('cursor:remote', { cursor, userId: socket.user.id })
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.user.email)
    })
  })
}
