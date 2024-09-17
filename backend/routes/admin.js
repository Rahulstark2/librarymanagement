const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware');
const router = express.Router();
require('dotenv').config();
const { Membership,Book,Movie } = require('../db');


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
      if (type === 'Book') {
        // Check if the book already exists
        const existingBook = await Book.findOne({ name });
        if (existingBook) {
          return res.status(400).json({ message: 'Book already exists' });
        }
        document = new Book({ name, procurementDate, quantity });
      } else {
        // Check if the movie already exists
        const existingMovie = await Movie.findOne({ name });
        if (existingMovie) {
          return res.status(400).json({ message: 'Movie already exists' });
        }
        document = new Movie({ name, procurementDate, quantity });
      }
      // Save the document to the database
      await document.save();

      res.status(200).json({ message: `${type} added successfully` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Error adding ${type}` });
    }
  });



module.exports = router;
