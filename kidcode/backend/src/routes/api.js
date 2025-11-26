const express = require('express');
const router = express.Router();
const lessons = require('../controllers/lessonsController');
const users = require('../controllers/usersController');
const rooms = require('../controllers/roomsController');
const auth = require('../middleware/auth');

router.get('/health', (req, res) => res.json({ status: 'ok', service: 'kidcode-backend' }));
router.get('/lessons', lessons.list);
router.get('/lessons/:id', lessons.getById);
// Protected: teachers and admins can manage lessons
router.post('/lessons', auth.verifyToken, auth.requireRoles('admin','teacher'), lessons.create);
router.put('/lessons/:id', auth.verifyToken, auth.requireRoles('admin','teacher'), lessons.update);
router.delete('/lessons/:id', auth.verifyToken, auth.requireRoles('admin','teacher'), lessons.remove);

// Auth endpoints
router.post('/auth/register', users.register);
router.post('/auth/login', users.login);
router.get('/auth/me', auth.verifyToken, users.me);
router.put('/auth/role', auth.verifyToken, auth.requireAdmin, users.setRole);

// Users endpoints
router.get('/users/students', auth.verifyToken, auth.requireRoles('admin','teacher'), users.listStudents);

module.exports = router;

// Rooms endpoints
router.get('/rooms', auth.verifyToken, rooms.list);
router.get('/rooms/:id', auth.verifyToken, rooms.getById);
router.post('/rooms', auth.verifyToken, auth.requireRoles('admin','teacher'), rooms.create);
router.post('/rooms/:id/join', auth.verifyToken, rooms.join);
router.delete('/rooms/:id', auth.verifyToken, auth.requireRoles('admin','teacher'), rooms.remove);
