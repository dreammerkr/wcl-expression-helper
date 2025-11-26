import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { WCLClient } from './query/WCLClient';
import { createQueryRouter } from './routes/query.routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.WCL_CLIENT_ID || !process.env.WCL_CLIENT_SECRET) {
  console.error('Error: WCL_CLIENT_ID and WCL_CLIENT_SECRET must be set in environment variables');
  console.error('Please create a .env file based on .env.example');
  process.exit(1);
}

// Initialize WCL client
const wclClient = new WCLClient({
  clientId: process.env.WCL_CLIENT_ID,
  clientSecret: process.env.WCL_CLIENT_SECRET,
});

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'WCL Query Maker API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      customQuery: 'POST /api/custom',
      report: 'GET /api/report/:code',
      fightDetails: 'GET /api/report/:code/fights/:fightIDs',
      tableData: 'GET /api/report/:code/table/:dataType?fightIDs=1,2',
      damageEvents: 'GET /api/report/:code/events/damage/:fightID',
      healingEvents: 'GET /api/report/:code/events/healing/:fightID',
      deaths: 'GET /api/report/:code/deaths/:fightID',
      skillTimeline: 'GET /api/report/:code/skills/:fightID',
      character: 'GET /api/character/:region/:server/:name',
      guild: 'GET /api/guild/:region/:server/:name',
    },
    visualization: 'GET /timeline.html',
  });
});

app.use('/api', createQueryRouter(wclClient));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`WCL Query Maker API is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nAvailable endpoints:');
  console.log(`  - GET  http://localhost:${PORT}/`);
  console.log(`  - GET  http://localhost:${PORT}/api/health`);
  console.log(`  - POST http://localhost:${PORT}/api/custom`);
  console.log(`  - GET  http://localhost:${PORT}/api/report/:code`);
  console.log(`  - GET  http://localhost:${PORT}/timeline.html - Timeline Visualizer`);
  console.log('\nSee full API documentation at http://localhost:' + PORT);
});

export { app, wclClient };
