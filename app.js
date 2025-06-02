require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger'); // Make sure this exists

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS config
app.use(cors({
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Custom middleware for errors/responses
const errorHandler = require('./middlewares/errorHandler');
const responseHandler = require('./middlewares/responseHandler');

app.use((req, res, next) => {
  res.sendError = errorHandler.bind(null, req, res);
  res.sendResponse = responseHandler.bind(null, res);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('🚀 API is working!');
});

app.use('/session', require('./routes/session'));
app.use('/message', require('./routes/message'));

// 404 Handler
app.use((req, res) => {
  res.status(404).send({ error: 'Not Found' });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
