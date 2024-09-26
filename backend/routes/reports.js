const express = require('express');
const { Book, Movie, Issue,Membership } = require('../db');
const { authMiddleware } = require('../middleware');
const router = express.Router();

require('dotenv').config();

router.get('/active-issues', authMiddleware, async (req, res) => {
    try {
      
      const activeIssues = await Issue.find({ status: 'issued' });

  
      const responseData = [];

      for (const issue of activeIssues) {
        let itemDetails;

       
        if (issue.itemType === 'Book') {
          const book = await Book.findById(issue.itemId);
          itemDetails = {
            name: book.name,
            serialNumber: book.serialNumber
          };
        } else if (issue.itemType === 'Movie') {
          const movie = await Movie.findById(issue.itemId);
          itemDetails = {
            name: movie.name,
            serialNumber: movie.serialNumber
          };
        }

      
        const membership = await Membership.findOne({ firstName: req.username });

        
        const issueDate = issue.issueDate.toLocaleDateString('en-GB');
        const returnDate = issue.returnDate.toLocaleDateString('en-GB');

        
        responseData.push({
          type: issue.itemType,
          serialNumber: itemDetails.serialNumber,
          name: itemDetails.name,
          membershipId: membership.membershipNumber,
          issueDate: issueDate,
          returnDate: returnDate
        });
      }

      
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching active issues:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/active-membership', authMiddleware, async (req, res) => {
    try {
      
      const activeMemberships = await Membership.find({});

      
      const responseData = [];

      
      const currentDate = new Date();

      for (const membership of activeMemberships) {
       
        const isActive = new Date(membership.endDate) >= currentDate;
        const status = isActive ? 'Active' : 'Inactive';

        
        const issues = await Issue.find({ username: membership.username });

       
        let amountPending = 0;
        for (const issue of issues) {
          if (new Date(issue.returnDate) < currentDate) {
            const daysLate = Math.floor((currentDate - new Date(issue.returnDate)) / (1000 * 60 * 60 * 24));
            amountPending += 50 + (daysLate * 10);
          }
        }

        
        responseData.push({
          membershipId: membership.membershipNumber,
          memberName: `${membership.firstName} ${membership.lastName}`,
          contactNumber: membership.contactNumber,
          contactAddress: membership.contactAddress,
          aadharCardNo: membership.aadharCardNo,
          startDate: new Date(membership.startDate).toLocaleDateString('en-GB'),
          endDate: new Date(membership.endDate).toLocaleDateString('en-GB'),
          status: status,
          amountPending: amountPending
        });
      }

      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching active memberships:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/books', authMiddleware, async (req, res) => {
    try {
      
      const books = await Book.find({});
  
      
      const responseData = books.map((book, index) => ({
        serialNumber: book.serialNumber,
        name: book.name,
        authorName: book.author,
        status: book.status,
        procurementDate: new Date(book.procurementDate).toLocaleDateString('en-GB'), // Format date as 'dd/mm/yyyy'
      }));
  
      
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/movies', authMiddleware, async (req, res) => {
    try {
     
      const movies = await Movie.find({});
  
      
      const responseData = movies.map((movie) => ({
        serialNumber: movie.serialNumber,
        name: movie.name,
        directorName: movie.director, 
        status: movie.status,
        procurementDate: new Date(movie.procurementDate).toLocaleDateString('en-GB'), // Format date as 'dd/mm/yyyy'
      }));
  
      
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
 
  router.get('/overdue-returns', authMiddleware, async (req, res) => {
    try {
    
      const membership = await Membership.findOne({ firstName: req.username });
      
     
      if (!membership) {
        
        return res.status(404).json({ message: 'Membership not found' });
      }
  
      const membershipNumber = membership.membershipNumber;
  
      
      const overdueIssues = await Issue.find({ status: 'issued' });
  
     
      const responseData = [];
      
      
      const currentDate = new Date();
  
     
      for (const issue of overdueIssues) {
        let itemDetails;
  
        
        if (issue.itemType === 'Book') {
          const book = await Book.findById(issue.itemId);
          if (book) {
            itemDetails = {
              name: book.name,
              serialNumber: book.serialNumber,
            };
          }
        } else if (issue.itemType === 'Movie') {
          const movie = await Movie.findById(issue.itemId);
          if (movie) {
            itemDetails = {
              name: movie.name,
              serialNumber: movie.serialNumber,
            };
          }
        }
  
        
        if (itemDetails) {
          const issueDate = issue.issueDate.toLocaleDateString('en-GB'); 
          const returnDate = issue.returnDate.toLocaleDateString('en-GB'); 
          
      
          let fine = 0;
          if (new Date(issue.returnDate) < currentDate) {
            const daysLate = Math.floor((currentDate - new Date(issue.returnDate)) / (1000 * 60 * 60 * 24));
            fine = 50 + (daysLate * 10);
          }
  
          responseData.push({
            type: issue.itemType,
            serialNumber: itemDetails.serialNumber,
            name: itemDetails.name,
            membershipId: membershipNumber, 
            issueDate: issueDate,
            returnDate: returnDate,
            fine: fine, 
          });
        }
      }
  
      
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching overdue returns:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  


  module.exports=router;


