const express = require('express');
const controller = require('../controllers/contentController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/:page', controller.getByPage);
router.post('/', requireAuth, controller.upsertBlock);
router.post('/:id/image', requireAuth, upload.single('image'), controller.uploadImage);
router.delete('/:id', requireAuth, controller.remove);

module.exports = router;
