const router = require('express').Router();
const { getMyMessages, sendMessage, getAllConversations, getUserMessages, adminReply } = require('../controllers/chatController');
const { auth, isAllowed } = require('../middleware/auth');

// User routes
router.get('/my', auth, getMyMessages);
router.post('/send', auth, sendMessage);

// Admin routes
router.get('/conversations', auth, isAllowed('admin'), getAllConversations);
router.get('/user/:userId', auth, isAllowed('admin'), getUserMessages);
router.post('/reply', auth, isAllowed('admin'), adminReply);

module.exports = router;
