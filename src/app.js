const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const apiRoutes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security & utility middleware
app.use(helmet());
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Routes
app.use('/api/v1', apiRoutes);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
