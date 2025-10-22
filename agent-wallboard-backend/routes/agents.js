const express = require('express');
const router = express.Router();
const controller = require('../controllers/agentController');

router.get('/', controller.getAllAgents);
router.get('/:agentId', controller.getAgentById);
router.post('/:agentId/login', controller.login);
router.post('/:agentId/logout', controller.logout);
router.patch('/:agentId/status', controller.updateAgentStatus);

module.exports = router;
