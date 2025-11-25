const express = require('express');
const router = express.Router();
const lessons = require('../controllers/lessonsController');
const users = require('../controllers/usersController');
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

module.exports = router;
