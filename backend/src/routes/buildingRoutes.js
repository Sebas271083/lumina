const express = require('express');
const controller = require('../controllers/buildingController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', controller.list);
router.get('/:slug', controller.getBySlug);

router.post('/', requireAuth, controller.create);
router.put('/:id', requireAuth, controller.update);
router.delete('/:id', requireAuth, controller.remove);
router.post('/:id/cover-image', requireAuth, upload.single('image'), controller.uploadCoverImage);
router.post('/:id/gallery-image', requireAuth, upload.single('image'), controller.uploadGalleryImage);

module.exports = router;
