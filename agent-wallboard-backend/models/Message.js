const mongoose = require('mongoose');

// A message from a supervisor to one agent, or to everyone when `to` is null.
const MessageSchema = new mongoose.Schema({
  from: { type: String, required: true, trim: true },
  to: { type: String, default: null, index: true },
  content: { type: String, required: true, trim: true, maxlength: 500 },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
