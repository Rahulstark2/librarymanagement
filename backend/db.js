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
    aadharCardNo: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    membershipType: { type: String, enum: ['Six Months', 'One Year', 'Two Years'], required: true },
    membershipNumber: { type: Number, required: true, unique: true }
  });

  // Define the Book schema
// Define the Book schema
const bookSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    procurementDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    serialNumber: { type: Number, required: true, unique: true },
    status: { type: String, default: 'Available' }
  });
  
  // Define the Movie schema
  const movieSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    procurementDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    serialNumber: { type: Number, required: true, unique: true },
    status: { type: String, default: 'Available' }
  });

  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: function() { return this.isNew; } }, // Password is required for new users
    status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    admin: { type: Boolean, default: false },
  });
  
  
  const Membership = mongoose.model('Membership', membershipSchema);
  const Book = mongoose.model('Book', bookSchema);
  const User = mongoose.model('User', userSchema);

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);
  
  module.exports = {Membership,Book,Movie, User};

