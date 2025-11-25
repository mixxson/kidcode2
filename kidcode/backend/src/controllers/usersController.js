const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const dataPath = path.join(__dirname, '..', 'data', 'users.json')

function readData(){
  try{ return JSON.parse(fs.readFileSync(dataPath,'utf8')) }catch(e){ return [] }
}
function writeData(d){ fs.writeFileSync(dataPath, JSON.stringify(d,null,2),'utf8') }

function makeToken(user){
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' })
}

exports.register = (req,res) => {
  const { email, password, adminKey } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const users = readData()
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'User exists' })
  const id = users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1
  const hash = bcrypt.hashSync(password, 8)
  // first registered user becomes admin automatically; otherwise require adminKey
  const isAdmin = users.length === 0 || (adminKey && adminKey === (process.env.ADMIN_KEY || ''))
  const user = { id, email, passwordHash: hash, isAdmin: !!isAdmin }
  users.push(user)
  writeData(users)
  const token = makeToken(user)
  res.status(201).json({ token, user: { id: user.id, email: user.email, isAdmin: user.isAdmin } })
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
  res.json({ token, user: { id: user.id, email: user.email, isAdmin: !!user.isAdmin } })
}

exports.me = (req,res) => {
  const users = readData()
  const user = users.find(u => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ user: { id: user.id, email: user.email, isAdmin: !!user.isAdmin } })
}
