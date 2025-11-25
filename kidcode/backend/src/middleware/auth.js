const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const usersPath = path.join(__dirname, '..', 'data', 'users.json')

function readUsers(){
  try{ return JSON.parse(fs.readFileSync(usersPath,'utf8')) }catch(e){ return [] }
}

function verifyToken(req, res, next){
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'No token' })
  const parts = auth.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' })
  const token = parts[1]
  try{
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret'
    const payload = jwt.verify(token, secret)
    // attach user data (fresh from file to reflect promotions)
    const users = readUsers()
    const user = users.find(u => u.id === payload.id)
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = { id: user.id, email: user.email, isAdmin: !!user.isAdmin }
    next()
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' })
  }
}

function requireAdmin(req, res, next){
  if (!req.user) return res.status(401).json({ error: 'No user' })
  if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' })
  next()
}

module.exports = { verifyToken, requireAdmin }
