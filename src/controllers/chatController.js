const Chat = require('../models/Chat');

exports.getMessages = async (req, res) => {
  try {
    const messages = await Chat.findAll({
      order: [['createdAt', 'ASC']],
      limit: 100,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, from } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Text required' });

    const userId = req.user?.id || null;
    const senderName = req.user?.fullName || (from === 'admin' ? 'Admin' : 'User');

    const msg = await Chat.create({ text, from: from || 'user', userId, senderName });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
