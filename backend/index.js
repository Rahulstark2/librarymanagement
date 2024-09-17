const express = require("express");
const cors = require("cors");


const mainRouter = require("./routes/index");

const app = express();
const allowedOrigins = ['http://localhost:5174', 'http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  
app.use(express.json());

app.use("/api/v1",mainRouter);
app.listen(3001);