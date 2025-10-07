const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', blogController.getAllPosts);

router.get('/create', isAuthenticated, blogController.getCreatePost);
router.post('/create', isAuthenticated, upload.single('image'), blogController.postCreatePost);

router.get('/:id', blogController.getPost);

router.get('/:id/edit', isAuthenticated, blogController.getEditPost);
router.post('/:id/edit', isAuthenticated, upload.single('image'), blogController.postEditPost);

router.post('/:id/delete', isAuthenticated, blogController.deletePost);

module.exports = router;
