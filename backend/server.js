require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

const mongoose = require('mongoose');
const dbConnectionString = process.env.MONGODB_URI;

mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to MongoDB database');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});


//Routers
app.use("/", require("./routers/userRouter"));
app.use("/", require("./routers/reviewRouter"));
app.use("/", require("./routers/routeRouter"));
app.use("/", require("./routers/imageRouter"));


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});