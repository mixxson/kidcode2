const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dataPath = path.join(__dirname, '..', 'data', 'users.json')

function readData(){
  try{
    const data = JSON.parse(fs.readFileSync(dataPath,'utf8'))
    // Normalize legacy users (ensure role)
    return data.map(u => ({
      ...u,
      role: u.role || (u.isAdmin ? 'admin' : 'student'),
      isAdmin: typeof u.isAdmin === 'boolean' ? u.isAdmin : (u.role === 'admin')
    }))
  }catch(e){ return [] }
}
function writeData(d){ fs.writeFileSync(dataPath, JSON.stringify(d,null,2),'utf8') }

function makeToken(user){
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
  return jwt.sign({ id: user.id, email: user.email, role: user.role || (user.isAdmin ? 'admin' : 'student') }, secret, { expiresIn: '7d' })
}

exports.register = (req,res) => {
  const { email, password, adminKey, role: desiredRole } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const users = readData()
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' })
  const id = users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1
  const hash = bcrypt.hashSync(password, 8)
  // Roles: admin | teacher | student
  // First user becomes admin automatically. Otherwise to create admin/teacher you must provide ADMIN_KEY.
  let role = 'student'
  const canElevate = users.length === 0 || (adminKey && adminKey === (process.env.ADMIN_KEY || ''))
  if (desiredRole && ['admin','teacher'].includes(desiredRole)){
    role = canElevate ? desiredRole : 'student'
  } else if (users.length === 0) {
    role = 'admin'
  }
  const user = { id, email, passwordHash: hash, role, isAdmin: role === 'admin' }
  users.push(user)
  writeData(users)
  const token = makeToken(user)
  res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } })
}

exports.login = (req,res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const users = readData()
  const user = users.find(u => u.email === email)
  if (!user) return res.status(400).json({ error: 'Invalid credentials' })
  const ok = bcrypt.compareSync(password, user.passwordHash)
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
  const token = makeToken(user)
  res.json({ token, user: { id: user.id, email: user.email, role: user.role, isAdmin: !!user.isAdmin } })
}

exports.me = (req,res) => {
  const users = readData()
  const user = users.find(u => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ user: { id: user.id, email: user.email, role: user.role, isAdmin: !!user.isAdmin } })
}

// Admin-only: change user role
exports.setRole = (req,res) => {
  const { userId, role } = req.body
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ error: 'Admin only' })
  if (!userId || !role || !['admin','teacher','student'].includes(role)){
    return res.status(400).json({ error: 'userId and role (admin|teacher|student) required' })
  }
  const users = readData()
  const idx = users.findIndex(u => u.id === Number(userId))
  if (idx === -1) return res.status(404).json({ error: 'User not found' })
  users[idx].role = role
  users[idx].isAdmin = role === 'admin'
  writeData(users)
  return res.json({ ok: true, user: { id: users[idx].id, email: users[idx].email, role: users[idx].role, isAdmin: users[idx].isAdmin } })
}

// Get list of students (for teachers/admins creating rooms)
exports.listStudents = (req, res) => {
  const users = readData()
  // Return only students with id and email (no sensitive data)
  const students = users
    .filter(u => u.role === 'student')
    .map(u => ({ id: u.id, email: u.email }))
  res.json({ students })
}
