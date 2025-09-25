import mongoose from 'mongoose';

const logEntrySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['LOG', 'ERROR', 'WARN', 'INFO']
  },
  method: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  endpoint: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false }); // Prevents subdocument _id clutter

const tracerLogSchema = new mongoose.Schema({
  traceId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  method: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  endpoint: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  statusCode: {
    type: Number,
    required: true,
    min: 100,
    max: 599
  },
  responseTime: {
    type: Number,
    required: true,
    min: 0
  },
  logs: {
    type: [logEntrySchema],
    default: []
  }
}, {
  timestamps: true
});

export default mongoose.model('TracerLog', tracerLogSchema);
