# Cinematic Portfolio & Admin Hub - Setup Guide

This project is a high-end cinematic portfolio featuring an engineering lab and a secure administrative backend.

## Prerequisites
- **Node.js** (v18.x or higher recommended)
- **npm**

## Installation & Launch

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Ensure `.env` contains:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secure_random_string
   ```

3. **Start the Engine**
   ```bash
   npm start
   ```

4. **Access Points**
   - **Portfolio**: [http://localhost:5000](http://localhost:5000)
   - **Projects Reel**: [http://localhost:5000/work](http://localhost:5000/work)
   - **Engineering Labs**: [http://localhost:5000/lab](http://localhost:5000/lab)
   - **Admin Terminal**: [http://localhost:5000/admin](http://localhost:5000/admin)
     - *Default Credentials*: admin / cinematic_node

## Core Systems
- **Frontend**: Three.js, GSAP, Tailwind CSS, physically-based rendering.
- **Backend**: Express.js, Sequelize (SQLite), JWT Authentication.
- **Security**: 
  - Helmet (Secure Headers/CSP)
  - Express-Rate-Limit (DDoS Prevention)
  - Input Sanitization & Escaping
  - HttpOnly JWT Cookies

---
*Production Core: ABDDEVELOPER Cinematic Engine v2.0*
