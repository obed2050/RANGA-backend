const Chat = require('../models/Chat');
const User = require('../models/User');

// User: bona messages ze gusa
exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Chat.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: ohereza message
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Text required' });

    const user = await User.findByPk(req.user.id, { attributes: ['fullName'] });
    const msg = await Chat.create({
      text,
      from: req.user.role === 'admin' ? 'admin' : 'user',
      userId: req.user.id,
      senderName: user?.fullName || 'User',
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: bona users bose bafite conversations
exports.getAllConversations = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'fullName', 'email', 'role'],
      include: [{
        model: Chat,
        as: 'chats',
        required: true,
        order: [['createdAt', 'DESC']],
      }],
    });

    const conversations = users.map((u) => {
      const chats = u.chats || [];
      const last = chats[chats.length - 1];
      const unread = chats.filter((c) => c.from === 'user').length;
      return {
        userId: u.id,
        fullName: u.fullName,
        email: u.email,
        lastMessage: last?.text || '',
        lastTime: last?.createdAt || null,
        unread,
      };
    });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: bona messages za user runaka
exports.getUserMessages = async (req, res) => {
  try {
    const messages = await Chat.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: subiza user
exports.adminReply = async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text?.trim() || !userId) return res.status(400).json({ message: 'text na userId birakenewe' });

    const msg = await Chat.create({
      text,
      from: 'admin',
      userId: parseInt(userId),
      senderName: 'Admin',
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
