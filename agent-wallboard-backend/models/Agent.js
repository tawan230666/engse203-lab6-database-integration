const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available','Active','Wrap Up','Not Ready'],
    default: 'Not Ready'
  },
  loginTime: { type: Date },
  lastStatusChange: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Agent', AgentSchema);
