const fs = require('fs')
const path = require('path')

const dataPath = path.join(__dirname, '..', 'data', 'progress.json')

function readProgress(){
  try{
    return JSON.parse(fs.readFileSync(dataPath,'utf8'))
  }catch(e){ return [] }
}

function writeProgress(data){
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8')
}

// Get user's progress for all lessons
exports.getUserProgress = (req, res) => {
  const userId = req.user.id
  const progress = readProgress()
  const userProgress = progress.filter(p => p.userId === userId)
  res.json({ progress: userProgress })
}

// Get user's progress for specific lesson
exports.getLessonProgress = (req, res) => {
  const userId = req.user.id
  const lessonId = parseInt(req.params.lessonId)
  
  const progress = readProgress()
  const lessonProgress = progress.find(p => p.userId === userId && p.lessonId === lessonId)
  
  res.json({ 
    progress: lessonProgress || { 
      userId, 
      lessonId, 
      status: 'new', 
      completedAt: null,
      startedAt: null
    } 
  })
}

// Update lesson progress
exports.updateProgress = (req, res) => {
  const userId = req.user.id
  const lessonId = parseInt(req.params.lessonId)
  const { status } = req.body
  
  // Valid statuses: new, in-progress, completed
  if (!['new', 'in-progress', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Use: new, in-progress, completed' })
  }
  
  const progress = readProgress()
  const existingIndex = progress.findIndex(p => p.userId === userId && p.lessonId === lessonId)
  
  const now = new Date().toISOString()
  
  if (existingIndex !== -1) {
    // Update existing progress
    progress[existingIndex].status = status
    progress[existingIndex].updatedAt = now
    
    if (status === 'in-progress' && !progress[existingIndex].startedAt) {
      progress[existingIndex].startedAt = now
    }
    
    if (status === 'completed') {
      progress[existingIndex].completedAt = now
    }
  } else {
    // Create new progress entry
    const newProgress = {
      userId,
      lessonId,
      status,
      startedAt: status === 'in-progress' || status === 'completed' ? now : null,
      completedAt: status === 'completed' ? now : null,
      createdAt: now,
      updatedAt: now
    }
    progress.push(newProgress)
  }
  
  writeProgress(progress)
  
  const updated = progress.find(p => p.userId === userId && p.lessonId === lessonId)
  res.json({ progress: updated })
}

// Get statistics
exports.getStatistics = (req, res) => {
  const userId = req.user.id
  const progress = readProgress()
  const userProgress = progress.filter(p => p.userId === userId)
  
  const stats = {
    total: userProgress.length,
    new: userProgress.filter(p => p.status === 'new').length,
    inProgress: userProgress.filter(p => p.status === 'in-progress').length,
    completed: userProgress.filter(p => p.status === 'completed').length
  }
  
  res.json({ statistics: stats })
}
