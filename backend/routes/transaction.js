const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const { Book, Movie, Issue,User, Fine } = require('../db');
const { authMiddleware } = require('../middleware');
const router = express.Router();

require('dotenv').config();


const searchSchema = z.object({
  itemQuery: z.string().optional(),
  personQuery: z.string().optional(),
  type: z.enum(['book', 'movie']),
});

const bookAvailabilitySchema = z.object({
  personId: z.string().optional(),
  itemId: z.string().optional(),
}).refine((data) => data.personId || data.itemId, {
  message: 'Missing itemId or personId query parameter',
});

const movieAvailabilitySchema = z.object({
  personId: z.string().optional(),
  itemId: z.string().optional(),
}).refine((data) => data.personId || data.itemId, {
  message: 'Missing itemId or personId query parameter',
});

const issueSchema = z.object({
  itemId: z.string(),
  issueDate: z.string().datetime(),
  returnDate: z.string().datetime(),
  remarks: z.string().optional(),
  type: z.enum(['book', 'movie']),
});

const returnSchema = z.object({
  itemId: z.string(),
  serialNumber: z.string(),
  issueDate: z.string().datetime(),
  returnDate: z.string().datetime(),
  remarks: z.string().optional(),
  type: z.enum(['book', 'movie']),
});

const fetchIssueDateSchema = z.object({
  name: z.string(),
  authorOrDirector: z.string(),
  serialNumber: z.string(),
});

const calculateFineSchema = z.object({
  actualReturnDate: z.string().datetime(),
  returnDate: z.string().datetime(),
});

const payFineSchema = z.object({
  type: z.enum(['Book', 'Movie']),
  name: z.string(),
  authorOrDirector: z.string(),
  serialNumber: z.string(),
  issueDate: z.string().datetime(),
  returnDate: z.string().datetime(),
  actualReturnDate: z.string().datetime(),
  fine: z.string(),
  finePaid: z.boolean(),
  remarks: z.string().optional(),
});



router.get('/search', authMiddleware, async (req, res) => {
  try {

    const { itemQuery, personQuery, type } = searchSchema.parse(req.query);

  
    if (type === 'book') {
      let searchCriteria = {};

      if (itemQuery) {
        
        searchCriteria.name = { $regex: itemQuery, $options: 'i' };
      }
      if (personQuery) {
        
        searchCriteria.author = { $regex: personQuery, $options: 'i' };
      }

      const books = await Book.find(searchCriteria).limit(10); 
      return res.json({
        books: books,
      });
    }

   
    if (type === 'movie') {
      let searchCriteria = {};

      if (itemQuery) {
       
        searchCriteria.name = { $regex: itemQuery, $options: 'i' };
      }
      if (personQuery) {
        
        searchCriteria.director = { $regex: personQuery, $options: 'i' };
      }
      const movies = await Movie.find(searchCriteria).limit(10); 
      return res.json({
        movies: movies,
      });
    }

    return res.status(400).json({ error: 'Invalid search type' });
  } catch (error) {
 
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /search route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/books/availability', authMiddleware, async (req, res) => {
  try {
   
    const { personId, itemId } = bookAvailabilitySchema.parse(req.query);

    let book;
    if (itemId) {
     
      book = await Book.findOne({ name: itemId });
    } else if (personId) {
      
      book = await Book.find({ author: personId });
    }

    if (!book || book.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (Array.isArray(book)) {
      
      return res.json(book.map(b => ({
        name: b.name,
        author: b.author,
        serialNumber: b.serialNumber,
        status: b.status
      })));
    } else {
      
      return res.json({
        name: book.name,
        author: book.author,
        serialNumber: book.serialNumber,
        status: book.status
      });
    }
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /books/availability route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/movies/availability', authMiddleware, async (req, res) => {
  try {
  
    const { personId, itemId } = movieAvailabilitySchema.parse(req.query);

    let movie;
    if (itemId) {
    
      movie = await Movie.findOne({name: itemId});
    } else if (personId) {
      
      movie = await Movie.find({ director: personId });
    }

    if (!movie || movie.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    if (Array.isArray(movie)) {
     
      return res.json(movie.map(m => ({
        name: m.name,
        director: m.director,
        status: m.status || false,
        serialNumber: m.serialNumber
      })));
    } else {
      
      return res.json({
        name: movie.name,
        director: movie.director,
        status: movie.status || false,
        serialNumber: movie.serialNumber
      });
    }
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /movies/availability route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/issue', authMiddleware, async (req, res) => {
  try {
    const { itemId, issueDate, returnDate, remarks, type } = issueSchema.parse(req.body);

    
    const username = req.username;

    
    const user = await User.findOne({ name: username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User is not active' });
    }

    let item;
    if (type === 'book') {
      item = await Book.findById(itemId);
    } else if (type === 'movie') {
      item = await Movie.findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

   
    if (item.status !== 'Available' || item.quantity <= 0) {
      return res.status(400).json({ error: 'Item is not available for issue' });
    }

    
    const existingIssue = await Issue.findOne({ itemId: item._id, status: 'issued' });
    if (existingIssue) {
      return res.status(400).json({ error: 'Item is already issued' });
    }

    
    item.quantity -= 1;

    
    if (item.quantity === 0) {
      item.status = 'Unavailable';
    }

    await item.save();

    
    const transaction = new Issue({
      itemId: item._id,
      itemType: type.charAt(0).toUpperCase() + type.slice(1), 
      issueDate: new Date(issueDate),
      returnDate: new Date(returnDate),
      remarks,
      username: username, 
    });

    await transaction.save();

    res.status(201).json({ message: 'Item issued successfully', transaction });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /issue route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/return', authMiddleware, async (req, res) => {
  try {
    const { itemId, serialNumber, issueDate, returnDate, remarks, type } = returnSchema.parse(req.body);

   
    const username = req.username;

    
    const user = await User.findOne({ name: username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

   
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'User is not active' });
    }

    let item;
    if (type === 'book') {
      item = await Book.findById(itemId);
    } else if (type === 'movie') {
      item = await Movie.findById(itemId);
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const issue = await Issue.findOne({ itemId: item._id, username: username, status: 'issued' });
    if (!issue) {
      return res.status(400).json({ error: 'Item is not issued to the user' });
    }

    
    
    if (item.serialNumber !== Number(serialNumber)) {
      return res.status(400).json({ error: 'Serial number does not match with the item' });
    }

    
   

    
    item.quantity += 1;

   
    if (item.quantity > 0) {
      item.status = 'Available';
    }

    await item.save();

   
    issue.status = 'returned';
    issue.returnDate = new Date(returnDate);
    issue.remarks = remarks;

    await issue.save();

    res.status(200).json({ message: 'Item returned successfully', transaction: issue });
  } catch (error) {
  
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /return route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/fetch-issue-date', authMiddleware, async (req, res) => {
  try {
    
    const { name, authorOrDirector, serialNumber } = fetchIssueDateSchema.parse(req.body);

   
    let item;
    const book = await Book.findOne({ name, author: authorOrDirector, serialNumber });
    if (book) {
      item = book;
    } else {
      const movie = await Movie.findOne({ name, director: authorOrDirector, serialNumber });
      if (movie) {
        item = movie;
      }
    }

    if (!item) {
      
      return res.status(404).json({ error: 'Item not found' });
    }

    
    const issue = await Issue.findOne({ itemId: item._id, status: 'issued' });

    if (!issue) {
      
      return res.status(404).json({ error: 'Issue transaction not found' });
    }

    res.status(200).json({ issueDate: issue.issueDate, returnDate: issue.returnDate });
  } catch (error) {
  
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /fetch-issue-date route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/calculate-fine', authMiddleware, async (req, res) => {
  try {
   
    const { actualReturnDate, returnDate } = calculateFineSchema.parse(req.body);

  
    const actualReturnDateObj = new Date(actualReturnDate);
    actualReturnDateObj.setHours(0, 0, 0, 0);
    const returnDateObj = new Date(returnDate);
    returnDateObj.setHours(0, 0, 0, 0); 
    const diffTime = Math.abs(actualReturnDateObj - returnDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let fine = 0;
    if (actualReturnDateObj > returnDateObj) {
      fine = 50 + (diffDays - 1) * 10; 
    }

    res.status(200).json({ fine });
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /calculate-fine route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/pay-fine', authMiddleware, async (req, res) => {
  try {
    
    const { type, name, authorOrDirector, serialNumber, issueDate, returnDate, actualReturnDate, fine, finePaid, remarks } = payFineSchema.parse(req.body);

    let issue;
    if (type === 'Book') {
      
      const book = await Book.findOne({ name, author: authorOrDirector, serialNumber });
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
    
      
      issue = await Issue.findOne({
        itemType: type,
        itemId: book._id,
        status: 'issued',
      });
    }
      
    else if (type === 'Movie') {

      const movie = await Movie.findOne({ name, director: authorOrDirector, serialNumber });
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      
      issue = await Issue.findOne({
        itemType: type,
        itemId: movie._id,
        status: 'issued',
      });
    } else {
      return res.status(400).json({ error: 'Invalid item type' });
    }
    
    if (!issue) {
      
      return res.status(404).json({ error: 'Issue not found' });
    }

    
    if (finePaid) {
     
      if (issue.username !== req.username) {
        return res.status(403).json({ error: 'Unauthorized to pay fine for this issue' });
      }
    
      
      issue.status = 'returned';
      await issue.save();
    
      
      const fine_save = new Fine({
        type,
        name,
        authorOrDirector,
        serialNumber,
        issueDate,
        returnDate,
        actualReturnDate,
        fine,
        finePaid,
        remarks,
      });
    
      
      await fine_save.save();
    
      res.status(200).json({ message: 'Fine paid successfully' });
    } else {
      res.status(400).json({ error: 'Fine has not been paid' });
    }
  } catch (error) {
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Error in /pay-fine route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
