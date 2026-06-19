import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cinematic_secret_node_99';

// ══════════════════════════════════════════
//  DATABASE SETUP (SQLite)
// ══════════════════════════════════════════
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'),
  logging: false
});

const Contact = sequelize.define('Contact', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false }
});

const Project = sequelize.define('Project', {
  title: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING },
  year: { type: DataTypes.STRING },
  tags: { type: DataTypes.STRING }, // Stored as comma-separated string
  description: { type: DataTypes.TEXT },
  link: { type: DataTypes.STRING }
});

// Sync Database
sequelize.sync();

// ══════════════════════════════════════════
//  SECURITY & MIDDLEWARE
// ══════════════════════════════════════════
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://grainy-gradients.vercel.app"],
      connectSrc: ["'self'"],
    },
  },
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later."
});

app.use('/api/', limiter);
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(__dirname));

// ══════════════════════════════════════════
//  AUTH MIDDLEWARE
// ══════════════════════════════════════════
const authenticateToken = (req, res, next) => {
  const token = req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: 'Access Denied: No Token' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid Token' });
  }
};

// ══════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════

// 1. Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.findAll();
    // Transform tags back to array for frontend
    const transformed = projects.map(p => ({
      ...p.dataValues,
      tags: p.tags ? p.tags.split(',') : []
    }));
    res.json(transformed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// 2. Secure Contact Form
app.post('/api/contact', [
  body('name').trim().escape().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('message').trim().escape().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, message } = req.body;
    await Contact.create({ name, email, message });
    res.json({ success: true, message: 'Transmission received and stored in database.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to store transmission' });
  }
});

// 3. Admin Login (Simple example)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demo: admin / cinematic_node
  if (username === 'admin' && password === 'cinematic_node') {
    const token = jwt.sign({ id: 1, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('admin_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.json({ success: true, message: 'Authentication successful.' });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// 4. Protected Route: Get Messages
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ══════════════════════════════════════════
//  PAGE ROUTING
// ══════════════════════════════════════════
app.get('/social', (req, res) => res.sendFile(path.join(__dirname, 'social.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

app.get('*', (req, res, next) => {
  if (req.path.includes('.')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, async () => {
  console.log(`\n\x1b[36m%s\x1b[0m`, `  ---------------------------------------`);
  console.log(`\x1b[36m%s\x1b[0m`, `  CINEMATIC BACKEND ENGINE v2.0 ACTIVE`);
  console.log(`\x1b[36m%s\x1b[0m`, `  SECURITY: HELMET & RATE-LIMITER ON`);
  console.log(`\x1b[36m%s\x1b[0m`, `  DATABASE: SQLITE CONNECTED`);
  console.log(`\x1b[36m%s\x1b[0m`, `  PORT: ${PORT}`);
  console.log(`\x1b[36m%s\x1b[0m`, `  ---------------------------------------\n`);

  // Seed some data if empty
  const count = await Project.count();
  if (count === 0) {
    await Project.create({
      title: 'Aperture',
      role: 'Lead Front-End Developer',
      year: '2025',
      tags: 'Next.js,Three.js,Tailwind',
      description: 'A commerce platform for a camera-gear retailer with a real-time 3D product configurer.',
      link: 'case-study.html'
    });
    await Project.create({
      title: 'Halcyon',
      role: 'Brand Site & Motion Design',
      year: '2024',
      tags: 'React,Framer Motion,GSAP',
      description: 'Marketing site for a design studio built around a single orchestrated scroll sequence.',
      link: '#'
    });
  }
});
