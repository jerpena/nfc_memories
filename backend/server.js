import 'dotenv/config';
import express from 'express';
const { PORT = 8000, NODE_ENV } = process.env;
import configRoutes from './routes/configRoutes.js';
import dbRoutes from './routes/dbRoutes.js';
import kodiRoutes from './routes/kodiRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './lib/logger.js';
import { setupNFC } from './lib/nfc.js';

// Temporary until able to cancel scan promises
process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err);
});


const app = express();
app.use(express.json());
// allow x-www-form-urlencoded request body
app.use(express.urlencoded({ extended: false }));
// Routes for configuration
app.use('/api/settings', configRoutes);
// set routes file for database
app.use('/api/db', dbRoutes);
app.use('/api/kodi', kodiRoutes);
app.use(errorHandler);
app.listen(PORT, () => logger.info(`API server started on port ${PORT}`));
// setupNFC();