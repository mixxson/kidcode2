// Kontroler lekcji — dane zapisywane do pliku JSON
const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '..', 'data', 'lessons.json')

function readData() {
  try {
    const raw = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8')
}

exports.list = (req, res) => {
  const lessons = readData()
  res.json({ lessons })
}

exports.getById = (req, res) => {
  const id = Number(req.params.id)
  const lessons = readData()
  const lesson = lessons.find(l => l.id === id)
  if (!lesson) return res.status(404).json({ error: 'Nie znaleziono lekcji' })
  res.json({ lesson })
}

exports.create = (req, res) => {
  const { title, difficulty, durationMin, content, starterCode, language } = req.body
  if (!title) return res.status(400).json({ error: 'Brak tytułu' })
  const lessons = readData()
  const id = lessons.length ? Math.max(...lessons.map(l => l.id)) + 1 : 1
  const lesson = { 
    id, 
    title, 
    difficulty: difficulty || 'Łatwy', 
    durationMin: durationMin || 10, 
    language: language || 'javascript',
    content: content || '', 
    starterCode: starterCode || '' 
  }
  lessons.push(lesson)
  writeData(lessons)
  res.status(201).json({ lesson })
}

exports.update = (req, res) => {
  const id = Number(req.params.id)
  const lessons = readData()
  const idx = lessons.findIndex(l => l.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Nie znaleziono lekcji' })
  const updated = Object.assign(lessons[idx], req.body)
  lessons[idx] = updated
  writeData(lessons)
  res.json({ lesson: updated })
}

exports.remove = (req, res) => {
  const id = Number(req.params.id)
  let lessons = readData()
  const exist = lessons.find(l => l.id === id)
  if (!exist) return res.status(404).json({ error: 'Nie znaleziono lekcji' })
  lessons = lessons.filter(l => l.id !== id)
  writeData(lessons)
  res.json({ success: true })
}
