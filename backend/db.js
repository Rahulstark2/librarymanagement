const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Failed to connect to MongoDB Atlas', err));

  const membershipSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactName: { type: String, required: true },
    contactAddress: { type: String, required: true },
    contactNumber: { type: String, required: true, match: /^\d+$/ },
    aadharCardNo: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    membershipType: { type: String, enum: ['Six Months', 'One Year', 'Two Years'], required: true },
    membershipNumber: { type: Number, required: true, unique: true }
  });
  


const bookSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    procurementDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    serialNumber: { type: Number, required: true, unique: true },
    status: { type: String, default: 'Available' }
  });
  
  

  const movieSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    director: { type: String, required: true }, 
    procurementDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    serialNumber: { type: Number, required: true, unique: true },
    status: { type: String, default: 'Available' }
  });
  

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: function() { return this.isNew; } }, 
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    admin: { type: Boolean, default: false },
  });

  const issueSchema = new mongoose.Schema({
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType'
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Book', 'Movie']
    },
    issueDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    },
    remarks: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['issued', 'returned'],
      default: 'issued'
    },
    username: {
      type: String,
      required: true
    }
  });

  const fineSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Book', 'Movie'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    authorOrDirector: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    actualReturnDate: {
      type: Date,
      required: true,
    },
    fine: {
      type: Number,
      required: true,
    },
    finePaid: {
      type: Boolean,
      required: true,
    },
    remarks: {
      type: String,
    },
  });

  const Fine = mongoose.model('Fine', fineSchema);
  const Issue = mongoose.model('Issue', issueSchema);
  const Membership = mongoose.model('Membership', membershipSchema);
  const Book = mongoose.model('Book', bookSchema);
  const User = mongoose.model('User', userSchema);

const Movie = mongoose.model('Movie', movieSchema);
  
  module.exports = {Membership,Book,Movie, User,Issue, Fine};

