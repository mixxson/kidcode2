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
    cors: { origin: '*', methods: ['GET','POST'] }
  })

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
    // Join/leave rooms
    socket.on('room:join', ({ roomId }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.join(roomName)
      socket.to(roomName).emit('user:joined', { userId: socket.user.id })
    })

    socket.on('room:leave', ({ roomId }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.leave(roomName)
      socket.to(roomName).emit('user:left', { userId: socket.user.id })
    })

    // Code sync basic events
    socket.on('code:update', ({ roomId, code, version }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.to(roomName).emit('code:remote-update', { code, version, userId: socket.user.id, ts: Date.now() })
    })

    socket.on('cursor:update', ({ roomId, cursor }) => {
      if (!roomId) return
      const roomName = `room:${roomId}`
      socket.to(roomName).emit('cursor:remote', { cursor, userId: socket.user.id })
    })

    socket.on('disconnect', () => {
      // Optionally broadcast disconnect
    })
  })
}
