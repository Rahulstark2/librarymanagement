const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../db');
const router = express.Router();
require('dotenv').config();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

router.post('/userlogin', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const name=username;

  
    const user = await User.findOne({ name });

    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }


    const passwordMatch = await bcrypt.compare(password, user.password);

   
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

  
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ username }, secret);

   
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
