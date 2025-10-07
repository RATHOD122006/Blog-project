const User = require('../models/user');

exports.getRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

exports.postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.render('auth/register', { error: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/register', { error: 'Username or email already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/blog');
  } catch (error) {
    res.render('auth/register', { error: 'Registration failed. Please try again.' });
  }
};

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid email or password' });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/blog');
  } catch (error) {
    res.render('auth/login', { error: 'Login failed. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/blog');
    }
    res.clearCookie('connect.sid');
    res.redirect('/auth/login');
  });
};
