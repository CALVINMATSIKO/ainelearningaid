const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const groqService = require('../services/groqService');

// Create a new chat
router.post('/', async (req, res) => {
  try {
    const { user_id, session_id, title } = req.body;

    if (!session_id && !user_id) {
      return res.status(400).json({ error: 'Either user_id or session_id is required' });
    }

    const chatId = await Chat.create({ user_id, session_id, title: title || 'New Chat' });
    const chat = await Chat.findById(chatId);

    res.status(201).json(chat.toJSON());
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Get chats for user or session
router.get('/', async (req, res) => {
  try {
    const { user_id, session_id, limit = 50, offset = 0 } = req.query;

    let chats;
    if (user_id) {
      chats = await Chat.findByUserId(user_id, parseInt(limit), parseInt(offset));
    } else if (session_id) {
      chats = await Chat.findBySessionId(session_id, parseInt(limit), parseInt(offset));
    } else {
      return res.status(400).json({ error: 'user_id or session_id is required' });
    }

    res.json(chats.map(chat => chat.toJSON()));
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get chat by ID
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat.toJSON());
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Get messages for a chat
router.get('/:id/messages', async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await chat.getMessages(parseInt(limit), parseInt(offset));
    res.json(messages.map(msg => msg.toJSON()));
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message to a chat
router.post('/:id/messages', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Save user message
    const userMessageId = await chat.addMessage({
      role: 'user',
      content: content.trim(),
      tokens_used: null // Will be calculated later if needed
    });

    // Get conversation history
    const messages = await chat.getMessages();
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate AI response
    const aiResponse = await groqService.generateChatResponse(conversationHistory);

    // Save AI message
    const aiMessageId = await chat.addMessage({
      role: 'assistant',
      content: aiResponse.content,
      tokens_used: aiResponse.tokens_used
    });

    // Get the saved messages
    const userMessage = await Message.findById(userMessageId);
    const aiMessage = await Message.findById(aiMessageId);

    res.status(201).json({
      user_message: userMessage.toJSON(),
      ai_message: aiMessage.toJSON(),
      processing_time: aiResponse.processing_time
    });
  } catch (error) {
    console.error('Send message error:', error);

    // Handle specific AI errors
    if (error.message.includes('API key') || error.message.includes('Rate limit')) {
      res.status(503).json({ error: 'AI service temporarily unavailable' });
    } else {
      res.status(500).json({ error: 'Failed to send message' });
    }
  }
});

// Update chat
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    await chat.update({ title });
    res.json(chat.toJSON());
  } catch (error) {
    console.error('Update chat error:', error);
    res.status(500).json({ error: 'Failed to update chat' });
  }
});

// Delete chat
router.delete('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    await chat.delete();
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

module.exports = router;