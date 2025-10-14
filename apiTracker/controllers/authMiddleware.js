const API_KEY = process.env.TRACER_API_KEY;

const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (API_KEY !== apiKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export default authMiddleware;