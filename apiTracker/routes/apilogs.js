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

// 🧪 Tracer logs
router.get('/logs', logData);

// 🎛️ Control settings
router.post('/controls', upsertControlSettings);
router.get('/controls/check', checkControlStatus);
router.get('/controls/data', getControlByEndpoint);

export default router;
