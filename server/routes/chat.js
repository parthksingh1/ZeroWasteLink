const express = require('express');
const Chat = require('../models/Chat');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get or create chat
router.post('/create', auth, async (req, res) => {
  try {
    const { participantId, donationId } = req.body;
    const currentUserId = req.user.userId;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, participantId] },
      donation: donationId
    }).populate('participants', 'name role organizationName');

    if (!chat) {
      chat = new Chat({
        participants: [currentUserId, participantId],
        donation: donationId,
        messages: []
      });
      await chat.save();
      await chat.populate('participants', 'name role organizationName');
    }

    res.json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's chats
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.userId,
      isActive: true
    })
    .populate('participants', 'name role organizationName')
    .populate('donation', 'title status')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get chat messages
router.get('/:chatId/messages', auth, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('messages.sender', 'name role')
      .populate('participants', 'name role organizationName');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(chat.messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/:chatId/messages', auth, async (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p.toString() === req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = {
      sender: req.user.userId,
      content,
      type,
      readBy: [{ user: req.user.userId }]
    };

    chat.messages.push(message);
    chat.lastMessage = message;
    await chat.save();

    await chat.populate('messages.sender', 'name role');

    res.json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;