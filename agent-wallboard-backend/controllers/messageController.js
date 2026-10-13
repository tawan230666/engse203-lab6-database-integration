const mongoose = require('mongoose');
const messageService = require('../services/messageService');
const { broadcast } = require('../utils/events');

const messageController = {
  async send(req, res, next) {
    try {
      const message = await messageService.create(req.body);
      broadcast(req, 'message:new', message);
      res.status(201).json({ success: true, data: message });
    } catch (err) { next(err); }
  },

  async getForAgent(req, res, next) {
    try {
      const messages = await messageService.getForAgent(req.params.agentId);
      res.json({ success: true, data: messages, unread: messages.filter((m) => !m.isRead).length });
    } catch (err) { next(err); }
  },

  async markAsRead(req, res, next) {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, error: 'Invalid message id' });
      }
      const message = await messageService.markAsRead(req.params.id);
      if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
      res.json({ success: true, data: message });
    } catch (err) { next(err); }
  },
};

module.exports = messageController;
