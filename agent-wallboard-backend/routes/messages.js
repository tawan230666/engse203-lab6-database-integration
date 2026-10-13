const express = require('express');
const controller = require('../controllers/messageController');
const { validate, messageSchema } = require('../middleware/validation');

const router = express.Router();

router.post('/', validate(messageSchema), controller.send);
router.get('/agent/:agentId', controller.getForAgent);
router.put('/:id/read', controller.markAsRead);

module.exports = router;
