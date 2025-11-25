const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '..', 'data', 'rooms.json')

function readData(){
  try { return JSON.parse(fs.readFileSync(dataPath,'utf8')) } catch(e){ return [] }
}
function writeData(d){ fs.writeFileSync(dataPath, JSON.stringify(d, null, 2), 'utf8') }

// Helpers
function canSeeRoom(user, room){
  if (!user) return false
  if (user.isAdmin) return true
  if (user.role === 'teacher' && room.teacherId === user.id) return true
  if (user.role === 'student' && room.studentId === user.id) return true
  return false
}

exports.list = (req, res) => {
  const rooms = readData()
  if (!req.user) return res.json({ rooms: [] })
  let filtered = rooms
  if (req.user.isAdmin) {
    // all
  } else if (req.user.role === 'teacher') {
    filtered = rooms.filter(r => r.teacherId === req.user.id)
  } else {
    filtered = rooms.filter(r => r.studentId === req.user.id)
  }
  res.json({ rooms: filtered })
}

exports.getById = (req, res) => {
  const id = Number(req.params.id)
  const rooms = readData()
  const room = rooms.find(r => r.id === id)
  if (!room || !canSeeRoom(req.user, room)) return res.status(404).json({ error: 'Not found' })
  res.json({ room })
}

exports.create = (req, res) => {
  const { name, studentId, lessonId, language = 'javascript', code = '' } = req.body
  if (!req.user || !(req.user.isAdmin || req.user.role === 'teacher')) return res.status(403).json({ error: 'Forbidden' })
  if (!name || !studentId) return res.status(400).json({ error: 'name and studentId required' })
  const rooms = readData()
  const id = rooms.length ? Math.max(...rooms.map(r=>r.id)) + 1 : 1
  const room = { id, name, teacherId: req.user.id, studentId: Number(studentId), lessonId: lessonId ? Number(lessonId) : null, language, code, createdAt: new Date().toISOString(), active: true }
  rooms.push(room)
  writeData(rooms)
  res.status(201).json({ room })
}

exports.remove = (req,res) => {
  const id = Number(req.params.id)
  const rooms = readData()
  const idx = rooms.findIndex(r => r.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const room = rooms[idx]
  if (!(req.user?.isAdmin || room.teacherId === req.user?.id)) return res.status(403).json({ error: 'Forbidden' })
  rooms.splice(idx,1)
  writeData(rooms)
  res.json({ success: true })
}

exports.join = (req,res) => {
  const id = Number(req.params.id)
  const rooms = readData()
  const room = rooms.find(r => r.id === id)
  if (!room || !canSeeRoom(req.user, room)) return res.status(404).json({ error: 'Not found' })
  // No server-side state for join; Socket.IO handles membership. Return room info.
  res.json({ ok: true, room })
}
