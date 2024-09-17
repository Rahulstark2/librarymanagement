const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware');
const router = express.Router();
require('dotenv').config();
const { Membership,Book,Movie,User } = require('../db');


// Define a schema for the login data
const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const membershipSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    contactName: z.string().min(1),
    contactAddress: z.string().min(1),
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
    procurementDate: z.string().min(1),
    quantity: z.number().min(1),
  });

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
    status: z.enum(['active', 'inactive']),
    admin: z.boolean(),
  });
  
  

// Admin login route
router.post('/adminlogin', (req, res) => {
  // Try to parse the request body with the schema
  const result = loginSchema.safeParse(req.body);

  // If the data is invalid, return a 400 status code and the errors
  if (!result.success) {
    return res.status(400).json({ errors: result.error.format() });
  }

  const { username, password } = result.data;

  // Here you would typically check the username and password against a database
  // For this example, we'll just check if they're equal to 'admin'
  if (username === 'admin' && password === 'admin') {
    // If the credentials are valid, create a JWT
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign({ username }, secret);
    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/addmembership', authMiddleware, async (req, res) => {
    // Try to parse the request body with the schema
    const result = membershipSchema.safeParse(req.body);

    // If the data is invalid, return a 400 status code and the errors
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }

    const membershipData = result.data;

    try {
      // Check if a membership with the same aadharCardNo already exists
      const existingMembership = await Membership.findOne({ aadharCardNo: membershipData.aadharCardNo });
      if (existingMembership) {
        return res.status(400).json({ message: 'A membership with this Aadhar card number already exists' });
      }

      // Find the last membership number in the database
      const lastMembership = await Membership.findOne().sort('-membershipNumber');
      const lastMembershipNumber = lastMembership ? lastMembership.membershipNumber : 0;

      // Generate a sequential membership number
      const membershipNumber = lastMembershipNumber + 1;

      // Create a new Membership document with the membership number
      const membership = new Membership({ ...membershipData, membershipNumber });

      // Save the document to the database
      await membership.save();

      res.status(200).json({ message: 'Membership added successfully', membershipNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error adding membership' });
    }
  });

router.put('/updatemembership', authMiddleware, async (req, res) => {
    // Try to parse the request body with the schema
    const result = updateMembershipSchema.safeParse(req.body);
  
    // If the data is invalid, return a 400 status code and the errors
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const updateData = result.data;
    try {
      // Find the membership by membershipNumber
      const membership = await Membership.findOne({ membershipNumber: updateData.membershipNumber });
  
      if (!membership) {
        return res.status(404).json({ message: 'Membership not found' });
      }
  
      // Update the membership information
      membership.startDate = updateData.startDate;
      membership.endDate = updateData.endDate;
  
      // Handle membership extension and removal
      if (updateData.membershipExtension) {
        // Add the extension to the endDate
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
        // Remove the membership
        await Membership.findOneAndDelete({ membershipNumber: updateData.membershipNumber });
        return res.status(200).json({ message: 'Membership removed successfully' });
      }
  
      // Save the updated membership to the database
      await membership.save();
  
      res.status(200).json({ message: 'Membership updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating membership' });
    }
  });
  router.post('/addbookmovie', authMiddleware, async (req, res) => {
    // Try to parse the request body with the schema
    const result = bookMovieSchema.safeParse(req.body);
  
    // If the data is invalid, return a 400 status code and the errors
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const { type, name, procurementDate, quantity } = result.data;
  
    try {
      let document;
      let lastDocument;
      let lastSerialNumber;
  
      if (type === 'Book') {
        // Check if the book already exists
        const existingBook = await Book.findOne({ name });
        if (existingBook) {
          return res.status(400).json({ message: 'Book already exists' });
        }
  
        // Find the last book in the database
        lastDocument = await Book.findOne().sort('-serialNumber');
        lastSerialNumber = lastDocument ? lastDocument.serialNumber : 0;
  
        // Generate a sequential serial number
        const serialNumber = lastSerialNumber + 1;
  
        document = new Book({ name, procurementDate, quantity, serialNumber });
      } else {
        // Check if the movie already exists
        const existingMovie = await Movie.findOne({ name });
        if (existingMovie) {
          return res.status(400).json({ message: 'Movie already exists' });
        }
  
        // Find the last movie in the database
        lastDocument = await Movie.findOne().sort('-serialNumber');
        lastSerialNumber = lastDocument ? lastDocument.serialNumber : 0;
  
        // Generate a sequential serial number
        const serialNumber = lastSerialNumber + 1;
  
        document = new Movie({ name, procurementDate, quantity, serialNumber });
      }
  
      // Save the document to the database
      await document.save();
  
      res.status(200).json({ message: `${type} added successfully`, lastSerialNumber });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Error adding ${type}` });
    }
  });

  router.put('/updatebookmovie', authMiddleware, async (req, res) => {
    // Try to parse the request body with the schema
    const result = updateBookMovieSchema.safeParse(req.body);
  
    // If the data is invalid, return a 400 status code and the errors
    if (!result.success) {
      return res.status(400).json({ errors: result.error.format() });
    }
  
    const { type, name, serialNo, status, date } = result.data;
    const serialNumber=serialNo
  
    try {
      let document;
  
      if (type === 'Book') {
        // Find the book by name and serialNo
        document = await Book.findOne({ name, serialNumber });
      } else {
        // Find the movie by name and serialNo
        document = await Movie.findOne({ name, serialNumber });
      }
  
      if (!document) {
        return res.status(404).json({ message: `${type} not found` });
      }
  
      // Update the book/movie information
      document.status = status;
      document.procurementDate = date;
  
      // Save the updated book/movie to the database
      await document.save();
  
      res.status(200).json({ message: `${type} updated successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Error updating ${type}` });
    }
  });

  router.post('/manageuser', authMiddleware, async (req, res) => {
    try {
      // Parse the request body against the schema
      const { userType, name, status, admin } = userSchema.parse(req.body);
  
      let user;
      if (userType === 'New User') {
        // Check if the user already exists
        const existingUser = await User.findOne({ name });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
  
        // Create a new user
        user = new User({ name, status, admin });
      } else {
        // Update an existing user
        user = await User.findOneAndUpdate({ name }, { status, admin }, { new: true });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      }
  
      // Save the user to the database
      await user.save();
  
      res.status(200).json({ message: 'User managed successfully', data: user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // If the error is a Zod error, send a 400 Bad Request response
        res.status(400).json({ message: 'Invalid request body', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Error managing user', error: error.message });
      }
    }
  });
  


module.exports = router;
