const Agent = require('../models/Agent');

async function getAll() {
  return Agent.find().lean();
}

async function getById(code) {
  return Agent.findOne({ code }).lean();
}

async function login(code, name) {
  let agent = await Agent.findOne({ code });
  if (!agent) {
    agent = await Agent.create({ code, name, status: 'Available', loginTime: new Date() });
  } else {
    agent.loginTime = new Date();
    agent.status = 'Available';
    await Agent.updateOne({ _id: agent._id }, { $set: { loginTime: agent.loginTime, status: agent.status }});
  }
  return getById(code);
}

async function logout(code) {
  const agent = await Agent.findOne({ code });
  if (!agent) return null;
  await Agent.updateOne({ code }, { $set: { status: 'Not Ready' }});
  return getById(code);
}

async function updateStatus(code, newStatus) {
  const valid = ['Available','Active','Wrap Up','Not Ready'];
  if (!valid.includes(newStatus)) {
    const err = new Error(`Invalid status. Valid options: ${valid.join(', ')}`);
    err.statusCode = 400;
    throw err;
  }
  const updated = await Agent.findOneAndUpdate(
    { code }, 
    { $set: { status: newStatus, lastStatusChange: new Date() } },
    { new: true }
  ).lean();
  return updated;
}

module.exports = { getAll, getById, login, logout, updateStatus };
