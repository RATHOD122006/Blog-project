const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
    res.render('blog/index', {
      posts,
      user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null
    });
  } catch (error) {
    res.status(500).send('Error fetching posts');
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('blog/view', {
      post,
      user: req.session.userId ? { id: req.session.userId, username: req.session.username } : null
    });
  } catch (error) {
    res.status(500).send('Error fetching post');
  }
};

exports.getCreatePost = (req, res) => {
  res.render('blog/create', { error: null, user: { id: req.session.userId, username: req.session.username } });
};

exports.postCreatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const post = new Post({
      title,
      content,
      image,
      author: req.session.userId
    });

    await post.save();
    res.redirect('/blog');
  } catch (error) {
    res.render('blog/create', {
      error: 'Failed to create post. Please try again.',
      user: { id: req.session.userId, username: req.session.username }
    });
  }
};

exports.getEditPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    res.render('blog/edit', {
      post,
      error: null,
      user: { id: req.session.userId, username: req.session.username }
    });
  } catch (error) {
    res.status(500).send('Error fetching post');
  }
};

exports.postEditPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    if (req.file) {
      if (post.image) {
        const oldImagePath = path.join(__dirname, '..', 'public', post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = `/uploads/${req.file.filename}`;
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.redirect(`/blog/${post._id}`);
  } catch (error) {
    res.status(500).send('Error updating post');
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send('Post not found');
    }

    if (post.author.toString() !== req.session.userId) {
      return res.status(403).send('Unauthorized');
    }

    if (post.image) {
      const imagePath = path.join(__dirname, '..', 'public', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/blog');
  } catch (error) {
    res.status(500).send('Error deleting post');
  }
};
