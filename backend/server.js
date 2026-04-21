import express from 'express';
import cors from 'cors';
import tripsRoutes from './routes/trips.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main route
app.use('/api/trips', tripsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nomad Compliance Tracker Backend Running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
