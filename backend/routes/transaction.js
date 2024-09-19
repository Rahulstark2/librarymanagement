const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { Book } = require('../db');
const { authMiddleware } = require('../middleware');
const router = express.Router();
require('dotenv').config();

// Define a Zod schema for input validation
const availabilitySchema = z.object({
  bookName: z.string().optional(),
  authorName: z.string().optional(),
}).refine((data) => data.bookName || data.authorName, {
  message: 'Either bookName or authorName is required.',
});

router.get('/check-availability', authMiddleware, async (req, res) => {
    try {
      
      const { bookName, authorName } = availabilitySchema.parse(req.query);
  
      // Check book availability
      if (bookName) {
        const book = await Book.findOne({ where: { name: bookName } });
        if (!book) return res.status(404).send({ message: 'Book not found.' });
        return res.send({ message: 'Book is available.' });
      }
  
      // Check author availability
      if (authorName) {
        const bookWithAuthor = await Book.findOne({ where: { author: authorName } });
        if (!bookWithAuthor) return res.status(404).send({ message: 'Author not found.' });
        return res.send({ message: 'Author is available.' });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors)
        return res.status(400).send({ message: error.errors });
      }
      res.status(500).send({ message: 'Internal server error.' });
    }
  });
  
  module.exports = router;