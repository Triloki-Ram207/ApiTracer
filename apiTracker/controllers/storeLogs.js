import TracerLog from '../models/tracerlogs.js';

const storeLogs=async (req, res) => {
  try {
    console.log('Received log:', req.body);
    const logEntry = new TracerLog(req.body);
    await logEntry.save();
    res.status(201).json({ message: 'Log stored in database' });
  } catch (err) {
    console.error('❌ Tracer API error:', err.message);
    res.status(500).json({ error: 'Failed to store log' });
  }
};

export default storeLogs;