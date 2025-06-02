require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error Handler
const errorHandler = require('./middlewares/errorHandler');

app.use((req, res, next) => {
  res.sendError = errorHandler.bind(null, req, res);
  next();
});

// Response Handler
const responseHandler = require('./middlewares/responseHandler');

app.use((req, res, next) => {
  res.sendResponse = responseHandler.bind(null, res);
  next();
});

// CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// Test route
app.get('/', (req, res) => {
  res.send('Hello Railway!');
});

// Routes
app.use('/session', require('./routes/session'));
app.use('/message', require('./routes/message'));

// 404 handler
app.use((req, res) => {
  res.status(404).send({ error: 'Not Found' });
});

// Logger
const { logger } = require('./utils/logger');

const HOST = '0.0.0.0';
const PORT = process.env.PORT || 3000;

app.listen(PORT, HOST, (err) => {
  if (err) {
    logger.error('Server failed to start:', err);
    process.exit(1);
  }
  const displayHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
  logger.info(`Server running at http://${displayHost}:${PORT}/`);
});

module.exports = app;
