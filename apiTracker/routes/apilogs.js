import express from 'express';
const router = express.Router();

import {
  logData
} from '../controllers/fetchLogs.js';

import {
  upsertControlSettings,
  checkControlStatus,
  getControlByEndpoint
} from '../controllers/controlSettings.js';

import authMiddleware from '../controllers/authMiddleware.js';
import storeLogs from '../controllers/storeLogs.js';

// 🧪 Tracer logs
router.get('/logs', logData);

// 🎛️ Control settings
router.post('/controls', upsertControlSettings);
router.get('/controls/check', checkControlStatus);
router.get('/controls/data', getControlByEndpoint);

 router.post('/storelogs', authMiddleware,storeLogs);

export default router;
