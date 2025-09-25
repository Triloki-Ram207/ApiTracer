import mongoose from 'mongoose';

const EndpointControlSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  // 🔒 Feature toggles
  api: { type: Boolean, default: false },
  tracer: { type: Boolean, default: false },
  limit: { type: Boolean, default: false },
  schedule: { type: Boolean, default: false },

  // 🚦 Rate limiting
  requestCount: {
    type: Number,
    default: 0,
    min: [0, 'Request count must be non-negative']
  },
  rateUnit: {
    type: String,
    enum: ['sec', 'min', 'hour'],
    default: 'sec'
  },

  // ⏰ Time-based tracing
  startTime: {
    type: String,
    match: [/^\d{2}:\d{2}$/, 'Start time must be in HH:MM format'],
    default: ''
  },
  endTime: {
    type: String,
    match: [/^\d{2}:\d{2}$/, 'End time must be in HH:MM format'],
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('ControlSettings', EndpointControlSchema);
