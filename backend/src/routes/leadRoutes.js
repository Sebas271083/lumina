const express = require('express');
const controller = require('../controllers/leadController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', controller.create);
router.get('/', requireAuth, controller.list);
router.put('/:id/status', requireAuth, controller.updateStatus);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
