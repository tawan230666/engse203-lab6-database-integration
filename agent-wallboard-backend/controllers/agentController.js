const agentService = require('../services/agentService');

const agentController = {
  async getAllAgents(req, res, next) {
    try {
      const agents = await agentService.getAll();
      res.json({ success: true, data: agents });
    } catch (err) { next(err); }
  },

  async getAgentById(req, res, next) {
    try {
      const agent = await agentService.getById(req.params.agentId);
      if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
      res.json({ success: true, data: agent });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const { agentId } = req.params;
      const { name } = req.body;
      const agent = await agentService.login(agentId, name || agentId);
      res.status(201).json({ success: true, message: 'Login success', data: agent });
    } catch (err) { next(err); }
  },

  async logout(req, res, next) {
    try {
      const { agentId } = req.params;
      const agent = await agentService.logout(agentId);
      if (!agent) return res.status(404).json({ success: false, error: 'Agent not found' });
      res.json({ success: true, message: 'Logout success', data: agent });
    } catch (err) { next(err); }
  },

  async updateAgentStatus(req, res, next) {
    try {
      const { agentId } = req.params;
      const { status } = req.body;
      if (!status) return res.status(400).json({ success: false, error: 'Status is required' });
      const updated = await agentService.updateStatus(agentId, status);
      if (!updated) return res.status(404).json({ success: false, error: 'Agent not found' });
      res.json({ success: true, message: 'Status updated successfully', data: updated });
    } catch (err) { next(err); }
  }
};

module.exports = agentController;
