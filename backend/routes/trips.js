import express from 'express';

const router = express.Router();

// Mock database for MVP phase
let mockTrips = [
  { id: 1, user_id: 'user_1', iso_code: 'ES', entry_date: '2025-01-10', exit_date: '2025-01-20', is_schengen: true },
  { id: 2, user_id: 'user_1', iso_code: 'TH', entry_date: '2025-02-01', exit_date: '2025-03-01', is_schengen: false },
  { id: 3, user_id: 'user_1', iso_code: 'IT', entry_date: '2025-03-10', exit_date: '2025-04-10', is_schengen: true },
];

let globalId = 4;

// Get all trips for (mocked) user
router.get('/', (req, res) => {
  res.json(mockTrips);
});

// Create a new trip
router.post('/', (req, res) => {
  const { iso_code, entry_date, exit_date, is_schengen } = req.body;
  if (!iso_code || !entry_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newTrip = {
    id: globalId++,
    user_id: 'user_1', // mocked user
    iso_code,
    entry_date,
    exit_date,
    is_schengen: is_schengen || false
  };

  mockTrips.push(newTrip);
  // Order chronologically
  mockTrips.sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date));
  res.status(201).json(newTrip);
});

// Delete a trip
router.delete('/:id', (req, res) => {
  const idToRemove = parseInt(req.params.id);
  mockTrips = mockTrips.filter(t => t.id !== idToRemove);
  res.status(200).json({ success: true, deleted: idToRemove });
});

export default router;
