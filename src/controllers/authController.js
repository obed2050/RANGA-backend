const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const normalizeUser = (user) => ({
  _id: String(user.id),
  id: user.id,
  name: user.fullName,
  fullName: user.fullName,
  email: user.email,
  phone: user.phoneNumber,
  phoneNumber: user.phoneNumber,
  role: user.role,
  avatar: user.avatar,
  location: user.location,
});

exports.register = async (req, res) => {
  try {
    const { name, fullName, email, password, phone, phoneNumber, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName: fullName || name,
      email,
      password: hashed,
      phoneNumber: phoneNumber || phone,
      role,
    });
    const token = generateToken(user);
    res.status(201).json({ token, user: normalizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: normalizeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(normalizeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
