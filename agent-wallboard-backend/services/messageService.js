const Message = require('../models/Message');

async function create({ from, to = null, content, priority = 'normal' }) {
  const message = await Message.create({ from, to, content, priority });
  return message.toObject();
}

// An agent's inbox: messages sent directly to them plus broadcasts.
async function getForAgent(agentCode) {
  return Message.find({ $or: [{ to: agentCode }, { to: null }] })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
}

async function markAsRead(id) {
  return Message.findByIdAndUpdate(id, { $set: { isRead: true } }, { new: true }).lean();
}

module.exports = { create, getForAgent, markAsRead };
