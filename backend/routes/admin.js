const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware');
const router = express.Router();
require('dotenv').config();
const { Membership,Book,Movie,User } = require('../db');
const bcrypt = require('bcrypt');


const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const membershipSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  contactName: z.string().min(1),
  contactAddress: z.string().min(1),
  contactNumber: z.string().regex(/^\d+$/),
  aadharCardNo: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  membershipType: z.string().min(1),
});


const updateMembershipSchema = z.object({
    membershipNumber: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    membershipExtension: z.string().optional(),
    membershipRemove: z.boolean().optional(),
  });

  const bookMovieSchema = z.object({
    type: z.enum(['Book', 'Movie']),
    name: z.string().min(1),
    author: z.string().optional(), 
    director: z.string().optional(), 
    procurementDate: z.string().min(1),
    quantity: z.number().min(1),
  }).refine((data) => {
    
    if (data.type === 'Book') {
      return data.author !== undefined;
    } else if (data.type === 'Movie') {
      return data.director !== undefined;
    }
    return false;
  }, 'Either author or director is required');
  

  const updateBookMovieSchema = z.object({
    type: z.enum(['Book', 'Movie']),
    name: z.string().min(1),
    serialNo: z.string().min(1),
    status: z.enum(['Available', 'Unavailable', 'Removed', 'On repair', 'To replace']),
    date: z.string().min(1),
  });

  
  const userSchema = z.object({
    userType: z.enum(['New User', 'Existing User']),
    name: z.string().min(1),
    password: z.string().optional(), 
    status: z.enum(['active', 'inactive']),
    admin: z.boolean(),
  });
  
  


router.post('/adminlogin', async (req, res) => {
    
    const result = loginSchema.safeParse(req.body);
  
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const { username, password } = result.data;
  
    try {
     
      if (username === 'admin' && password === 'admin') {
        
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ username }, secret);
        return res.status(200).json({ message: 'Login successful', token });
      }
  
      
      const user = await User.findOne({ name: username, admin: true });
  
     
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        
        if (passwordMatch) {
          const secret = process.env.JWT_SECRET;
          const token = jwt.sign({ username }, secret);
          return res.status(200).json({ message: 'Login successful', token });
        }
      }
  
      
      return res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
      
      return res.status(500).json({ message: 'An error occurred during login', error });
    }
  });
  

  router.post('/addmembership', authMiddleware, async (req, res) => {
    
    const result = membershipSchema.safeParse(req.body);
  
   
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const membershipData = result.data;
  
    try {
      
      const existingMembership = await Membership.findOne({ aadharCardNo: membershipData.aadharCardNo });
      if (existingMembership) {
        return res.status(400).json({ message: 'A membership with this Aadhar card number already exists' });
      }
  
     
      const lastMembership = await Membership.findOne().sort('-membershipNumber');
      const lastMembershipNumber = lastMembership ? lastMembership.membershipNumber : 0;
  
      
      const membershipNumber = lastMembershipNumber + 1;
  
      
      const membership = new Membership({ ...membershipData, membershipNumber, contactNumber: membershipData.contactNumber });
  
      
      await membership.save();
  
      res.status(200).json({ message: 'Membership added successfully', membershipNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding membership' });
    }
  });
  

router.put('/updatemembership', authMiddleware, async (req, res) => {
    
    const result = updateMembershipSchema.safeParse(req.body);
  
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const updateData = result.data;
    try {
      
      const membership = await Membership.findOne({ membershipNumber: updateData.membershipNumber });
  
      if (!membership) {
        return res.status(404).json({ message: 'Membership not found' });
      }
  
     
      membership.startDate = updateData.startDate;
      membership.endDate = updateData.endDate;
  
      
      if (updateData.membershipExtension) {
        
        const currentEndDate = new Date(membership.endDate);
        let newEndDate;
      
        switch (updateData.membershipExtension) {
          case 'Six Months':
            newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 6));
            break;
          case 'One Year':
            newEndDate = new Date(currentEndDate.setFullYear(currentEndDate.getFullYear() + 1));
            break;
          case 'Two Years':
            newEndDate = new Date(currentEndDate.setFullYear(currentEndDate.getFullYear() + 2));
            break;
          default:
            return res.status(400).json({ message: 'Invalid membership extension value' });
        }
      
        membership.endDate = newEndDate;
      }
  
      if (updateData.membershipRemove) {
        
        await Membership.findOneAndDelete({ membershipNumber: updateData.membershipNumber });
        return res.status(200).json({ message: 'Membership removed successfully' });
      }
  
     
      await membership.save();
  
      res.status(200).json({ message: 'Membership updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating membership' });
    }
  });
  router.post('/addbookmovie', authMiddleware, async (req, res) => {
    
    const result = bookMovieSchema.safeParse(req.body);
  
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const { type, name, author, director, procurementDate, quantity } = result.data;
  
    try {
      let document;
      let lastDocument;
      let lastSerialNumber;
  
      if (type === 'Book') {
        
        const existingBook = await Book.findOne({ name, author });
        if (existingBook) {
          return res.status(400).json({ message: 'Book already exists' });
        }
  
      
        lastDocument = await Book.findOne().sort('-serialNumber');
        lastSerialNumber = lastDocument ? lastDocument.serialNumber : 0;
  
        
        const serialNumber = lastSerialNumber + 1;
  
        document = new Book({ name, author, procurementDate, quantity, serialNumber });
      } else {
        
        const existingMovie = await Movie.findOne({ name, director });
        if (existingMovie) {
          return res.status(400).json({ message: 'Movie already exists' });
        }
  
        lastDocument = await Movie.findOne().sort('-serialNumber');
        lastSerialNumber = lastDocument ? lastDocument.serialNumber : 0;
  
        
        const serialNumber = lastSerialNumber + 1;
  
        document = new Movie({ name, director, procurementDate, quantity, serialNumber });
      }
  
      
      await document.save();
  
      res.status(200).json({ message: `${type} added successfully`, lastSerialNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Error adding ${type}` });
    }
  });
  

  router.put('/updatebookmovie', authMiddleware, async (req, res) => {
   
    const result = updateBookMovieSchema.safeParse(req.body);
    
  
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const { type, name, serialNo, status, date } = result.data;
    const serialNumber=serialNo
  
    try {
      let document;
  
      if (type === 'Book') {
        
        document = await Book.findOne({ name, serialNumber });
      } else {
        
        document = await Movie.findOne({ name, serialNumber });
      }
  
      if (!document) {
        return res.status(404).json({ message: `${type} not found` });
      }
  
      
      document.status = status;
      document.procurementDate = date;
  
      
      await document.save();
  
      res.status(200).json({ message: `${type} updated successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Error updating ${type}` });
    }
  });

  router.post('/manageuser', authMiddleware, async (req, res) => {
    try {
     
      
      const { userType, name, password, status, admin } = userSchema.parse(req.body);
      let user;
      if (userType === 'New User') {
       
        const existingUser = await User.findOne({ name });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
  
        
        const hashedPassword = await bcrypt.hash(password, 10);
  
        user = new User({ name, password: hashedPassword, status, admin });
      } else {
        
        user = await User.findOneAndUpdate({ name }, { status, admin }, { new: true });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
        }
      }
  
      
      await user.save();
  
      res.status(200).json({ message: 'User managed successfully', data: user });
    } catch (error) {
      
    }
  });
  


module.exports = router;
