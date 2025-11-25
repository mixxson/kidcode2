import { io } from 'socket.io-client'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
let socket

export function connectSocket(){
  const token = localStorage.getItem('kidcode_token')
  socket = io(API_BASE, {
    transports: ['websocket'],
    auth: { token }
  })
  return socket
}

export function getSocket(){
  if (!socket) return connectSocket()
  return socket
}

export function joinRoom(roomId){
  const s = getSocket()
  s.emit('room:join', { roomId })
}

export function leaveRoom(roomId){
  const s = getSocket()
  s.emit('room:leave', { roomId })
}

export function onRemoteCodeUpdate(handler){
  const s = getSocket()
  s.on('code:remote-update', handler)
  return () => s.off('code:remote-update', handler)
}

export function sendCodeUpdate(roomId, code, version){
  const s = getSocket()
  s.emit('code:update', { roomId, code, version })
}
