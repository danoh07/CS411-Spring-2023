const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// TODO: Set up your MongoDB connection and API routes here

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`);
});
